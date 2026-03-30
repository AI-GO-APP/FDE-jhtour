"""共用的 XLSX XML streaming 讀取器 — 解決 dimension ref="A1" bug"""
import zipfile
import io
import xml.etree.ElementTree as ET

NS = '{http://schemas.openxmlformats.org/spreadsheetml/2006/main}'


def read_xlsx_streaming(filepath: str, sheet_index: int = 0, max_rows: int = None):
    """
    用 XML streaming 方式讀取有 dimension bug 的 xlsx。
    回傳 generator，每次 yield 一個 dict（欄位名稱 → 值）。
    第一行視為 header。
    """
    z = zipfile.ZipFile(filepath)

    # 1. 讀取 sharedStrings
    strings = []
    try:
        ss_xml = z.read('xl/sharedStrings.xml')
        root = ET.fromstring(ss_xml)
        for si in root.findall(f'{NS}si'):
            t = si.find(f'{NS}t')
            if t is not None and t.text:
                strings.append(t.text)
            else:
                # 處理 richText (<si><r><t>...</t></r></si>)
                parts = []
                for r in si.findall(f'{NS}r'):
                    rt = r.find(f'{NS}t')
                    if rt is not None and rt.text:
                        parts.append(rt.text)
                strings.append(''.join(parts))
    except KeyError:
        pass

    # 2. 讀取 sheet XML
    sheet_file = f'xl/worksheets/sheet{sheet_index + 1}.xml'
    s_bytes = z.read(sheet_file)

    # 3. Streaming parse
    context = ET.iterparse(io.BytesIO(s_bytes), events=('end',))
    headers = None
    row_count = 0

    for event, elem in context:
        if elem.tag == f'{NS}row':
            row_count += 1
            cells = elem.findall(f'{NS}c')
            values = []
            for c in cells:
                t = c.get('t', '')
                v = c.find(f'{NS}v')
                val = v.text if v is not None else ''
                if t == 's' and val:
                    idx = int(val)
                    val = strings[idx] if idx < len(strings) else ''
                values.append(val if val else '')

            if row_count == 1:
                headers = values
            else:
                row_dict = {}
                for i, h in enumerate(headers):
                    row_dict[h] = values[i] if i < len(values) else ''
                yield row_dict

            elem.clear()

            if max_rows and row_count > max_rows:
                break

    z.close()


def get_sheet_names(filepath: str) -> list:
    """取得 xlsx 的所有 sheet 名稱"""
    z = zipfile.ZipFile(filepath)
    wb_xml = z.read('xl/workbook.xml')
    root = ET.fromstring(wb_xml)
    sheets = []
    for s in root.iter(f'{NS}sheet'):
        sheets.append(s.get('name'))
    z.close()
    return sheets


def get_row_count(filepath: str, sheet_index: int = 0) -> int:
    """取得 sheet 的總行數（含 header）"""
    z = zipfile.ZipFile(filepath)
    sheet_file = f'xl/worksheets/sheet{sheet_index + 1}.xml'
    s_bytes = z.read(sheet_file)
    context = ET.iterparse(io.BytesIO(s_bytes), events=('end',))
    count = 0
    for event, elem in context:
        if elem.tag == f'{NS}row':
            count += 1
            elem.clear()
    z.close()
    return count
