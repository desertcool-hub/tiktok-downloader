from importlib.metadata import distribution
from pathlib import Path
import shutil
import subprocess

from setuptools import Distribution, setup
from setuptools.command.build_py import build_py


class BundledRuntime(build_py):
    def run(self):
        super().run()
        from deno._find_deno import find_deno_bin
        source = find_deno_bin()
        version = subprocess.check_output([source, '--version'], text=True).splitlines()[0]
        if version.split()[:2] != ['deno', '2.9.7']:
            raise RuntimeError('Unexpected Deno version')
        destination = Path(self.build_lib) / 'vidsavenow_runtime' / 'deno'
        shutil.copyfile(source, destination)
        destination.chmod(0o755)
        deno = distribution('deno')
        license_file = next(file for file in deno.files if file.name == 'LICENSE')
        shutil.copyfile(deno.locate_file(license_file), destination.with_name('LICENSE-DENO'))


class PlatformDistribution(Distribution):
    def has_ext_modules(self):
        # The included executable is platform-specific even though the wrapper is Python.
        return True


setup(
    name='vidsavenow-youtube-runtime',
    version='2.9.7',
    packages=['vidsavenow_runtime'],
    package_data={'vidsavenow_runtime': ['deno', 'LICENSE-DENO']},
    cmdclass={'build_py': BundledRuntime},
    distclass=PlatformDistribution,
)
