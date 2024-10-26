"""YAML Parser

Contains parser for .yml files

"""

from typing import Any, Dict, Union, List
from pathlib import Path

from application.parser.file.base_parser import BaseParser

class YAMLParser(BaseParser):
    """
        Args:
        concat_rows (bool): Whether to concatenate all items into one document.
            If set to False, returns a dictionary structure. True by default.

        Refer to https://pyyaml.org/wiki/PyYAMLDocumentation for more information.

    """
    
    def __init__(
            self,
            *args: Any,
            concat_rows: bool = True,
            row_joiner: str = "\n",
            **kwargs: Any
    ) -> None:
        """Init Params."""
        super().__init__(*args,**kwargs)
        self._concat_rows = concat_rows
        self._row_joiner = row_joiner

    def _init_parser(self) -> Dict:
        """Init Parser."""
        return {}
    
    def parse_file(self, file: Path, errors: str=="ignore") -> Union[str, List[str]]:
        """Parse file."""
        try:
            import yaml
        except ImportError:
            raise ValueError("yaml module is required to read yml files.")

        data = yaml.safe_load(file)
        text_list = [yaml.dump(item, default_flow_style=False) for item in data]

        if self._concat_rows:
            return self._row_joiner.join(text_list)
        else:
            return data
