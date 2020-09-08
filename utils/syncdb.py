from datetime import datetime
from firebase_admin import firestore
from google.cloud.exceptions import NotFound
from google.cloud.firestore_v1 import CollectionReference
from slugify import slugify


def decode_val(value, db):
    if type(value) is str and value.startswith('doc://'):
        return db.document(value[6:])

    elif type(value) is str and value.startswith('date://'):
        return datetime.fromisoformat(value[7:].replace('Z', '+00:00'))

    elif isinstance(value, (int, float, bool, str)) or value is None:
        return value

    elif type(value) is list:
        return [decode_val(el, db) for el in value]

    elif type(value) is dict:
        return {k: decode_val(v, db) for k, v in value.items()}


def encode_val(value):
    if type(value) is firestore.firestore.DocumentReference:
        return f'doc://{value.path}'

    elif type(value) is str and value.startswith('date://'):
        return datetime.fromisoformat(value[7:].replace('Z', '+00:00'))

    elif isinstance(value, (int, float, bool, str)) or value is None:
        return value

    elif type(value) is list:
        return [encode_val(el) for el in value]

    elif type(value) is dict:
        return {k: encode_val(v) for k, v in value.items()}


def load_document(obj, document, db):
    sub_collections = {el[0][6:]: el[1] for el in filter(lambda el: el[0].startswith('sub://'), obj.items())}
    obj = dict(filter(lambda el: not el[0].startswith('sub://'), obj.items()))

    try:
        document.update({k: decode_val(v, db) for k, v in obj.items()})
    except NotFound:
        document.set({k: decode_val(v, db) for k, v in obj.items()})
    print(f"updated {document.path}")

    load_collections(sub_collections, document, db)


def load_collections(obj: dict, base_doc, db):
    for name, data in obj.items():
        collection = base_doc.collection(name)

        for k, v in data.items():
            if k.startswith('auto://'):
                doc = collection.document()
            elif k.startswith('slug://'):
                name = k[7:].split(":")[0]
                if v[name]:
                    doc = collection.document(slugify(v[name]))
                else:
                    doc = collection.document()
            else:
                doc = collection.document(k)

            load_document(v, doc, db)


def _dump_collection(collection, depth=0):
    data = {}
    for doc in collection:
        if type(doc) == CollectionReference:
            doc = doc.get()

        data[doc.id] = encode_val(doc.to_dict())

        if depth != 0:
            for collection in doc.reference.collections():
                data[doc.id]['sub://' + collection.id] = _dump_collection(
                    collection.get(),
                    depth - 1 if depth > 0 else depth
                )

    return data


def dump_collections(collections, base_doc, depth=0):
    data = {}

    if type(collections) is str:
        collections = [collections]

    for collection in collections:
        data[collection] = _dump_collection(base_doc.collection(collection).get(), depth)

    return data
