"""XML parser.

Contains parser for .xml
 files

"""
from pathlib import Path
from typing import Any, Dict, List, Union

from application.parser.file.base_parser import BaseParser

class XMLParser(BaseParser):
    r"""XML (.xml) parser.

    Parses XML files using Pandas `read_xml` function.
    If special parameters are required, use the `pandas_config` dict.

    Args:
        concat_rows (bool): whether to concatenate all rows into one document.
            If set to False, a Document will be created for each row.
            True by default.

        col_joiner (str): Separator to use for joining cols per row.
            Set to ", " by default.

        row_joiner (str): Separator to use for joining each row.
            Only used when `concat_rows=True`.
            Set to "\n" by default.

        pandas_config (dict): Options for the `pandas.read_xml` function call.
            Refer to https://pandas.pydata.org/docs/reference/api/pandas.read_xml.html
            for more information.
            Set to empty dict by default, meaning pandas will try to figure
            out the structure of the XML on its own.

    """

    def __init__(
            self,
            *args: Any,
            concat_rows: bool = True,
            col_joiner: str = ", ",
            row_joiner: str = "\n",
            pandas_config: dict = {},
            **kwargs: Any
    ) -> None:
        """Init params."""
        super().__init__(*args, **kwargs)
        self._concat_rows = concat_rows
        self._col_joiner = col_joiner
        self._row_joiner = row_joiner
        self._pandas_config = pandas_config

    def _init_parser(self) -> Dict:
        """Init parser."""
        return {}

    def parse_file(self, file: Path, errors: str = "ignore") -> Union[str, List[str]]:
        """Parse file."""
        try:
            import pandas as pd
        except ImportError:
            raise ValueError("pandas module is required to read Excel files.")

        df = pd.read_xml(file, **self._pandas_config)

        text_list = df.apply(
            lambda row: (self._col_joiner).join(row.astype(str).tolist()), axis=1
        ).tolist()

        if self._concat_rows:
            return (self._row_joiner).join(text_list)
        else:
            return text_list