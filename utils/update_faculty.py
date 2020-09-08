import json

import firebase_admin
from dotenv import load_dotenv
from firebase_admin import firestore
from slugify import slugify

load_dotenv()
default_app = firebase_admin.initialize_app()
db = firestore.client()


def update_faculty(teachers):
    slugs = []
    for teacher in teachers:
        i = 1
        slug = slugify(teacher['name'])

        while slug in slugs:
            slug = slugify(teacher['name'] + ' ' + str(i))
            i += 1

        slugs.append(slug)
        db.collection('teachers').document(slug).set(teacher)
        print(slug)


if __name__ == '__main__':
    with open('data/faculty.json') as f:
        update_faculty(json.load(f))
