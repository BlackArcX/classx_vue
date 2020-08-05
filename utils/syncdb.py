import json
import firebase_admin
from datetime import datetime
from dotenv import load_dotenv
from firebase_admin import firestore

load_dotenv()
default_app = firebase_admin.initialize_app()
db = firestore.client()


def get_val(value):
    if type(value) is str and value.startswith('doc://'):
        return db.document(value[6:])

    elif type(value) is str and value.startswith('date://'):
        return datetime.fromisoformat(value[7:].replace('Z', '+00:00'))

    elif isinstance(value, (int, float, bool, str)) or value is None:
        return value

    elif type(value) is list:
        return [get_val(el) for el in value]

    elif type(value) is dict:
        return {k: get_val(v) for k, v in value.items()}


def update_document(obj, document):
    sub_collections = {el[0][6:]: el[1] for el in filter(lambda el: el[0].startswith('sub://'), obj.items())}
    obj = dict(filter(lambda el: not el[0].startswith('sub://'), obj.items()))

    document.set(obj)
    print(f"updated {document.path}")

    update_collections(sub_collections, document)


def update_collections(obj: dict, base_doc):
    for name, data in obj.items():
        collection = base_doc.collection(name)

        for k, v in data.items():
            doc = collection.document() if k.startswith('auto://') else collection.document(k)
            update_document(v, doc)


if __name__ == '__main__':
    with open('data/classes.json') as f:
        data = json.load(f)
        update_collections(get_val(data), db)
