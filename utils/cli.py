import json

import click
import firebase_admin
from dotenv import load_dotenv
from firebase_admin import firestore

import syncdb


@click.group()
@click.pass_context
def cli(ctx):
    ctx.ensure_object(dict)

    load_dotenv()
    firebase_admin.initialize_app()

    ctx.obj['db'] = firestore.client()


@cli.command()
@click.argument('file', type=click.File('r'))
@click.option('--base', '-b', default=None, type=str)
@click.pass_context
def load(ctx, file, base):
    data = json.load(file)
    base_doc = ctx.obj['db'] if base is None else ctx.obj['db'].document(base)
    syncdb.load_collections(data, base_doc, ctx.obj['db'])


@cli.command()
@click.argument('collections', nargs=-1, type=str)
@click.option('--base', '-b', default=None, type=str)
@click.option('--depth', '-d', default=-1, type=int)
@click.option('--out', '-o', type=click.File('w'))
@click.pass_context
def dump(ctx, collections, base, depth, out):
    data = syncdb.dump_collections(
        collections,
        ctx.obj['db'].document(base) if base is not None else ctx.obj['db'],
        depth
    )

    if out is not None:
        json.dump(data, out)
    else:
        click.echo(json.dumps(data))


if __name__ == '__main__':
    cli()
