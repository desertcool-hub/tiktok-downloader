from pathlib import Path


def deno_binary():
    return str(Path(__file__).with_name('deno'))
