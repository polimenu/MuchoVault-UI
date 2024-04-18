import { Display } from "@Views/Common/Tooltips/Display";
import { IPoolsData, poolsAtom } from "../poolsAtom";

import styled from '@emotion/styled';

const getBorderType = () => {
    return 'collapse';
};
const getBorder = () => {
    return 'none';
};
const TableBackground = styled.div`
  --border-radius: 8px;
  --padding-left: 15px;
  overflow-x: hidden;
  border-radius: 12px 12px;

  & ::-webkit-scrollbar {
    background: var(--bg-grey);
    height: 2px !important;
    width: 3px !important;
  }

  table {
    border: ${getBorder};
    width: ${({ shouldShowMobile }: { shouldShowMobile: boolean }) =>
        shouldShowMobile ? 'max-content' : 'max(100%, 500px)'};
    border-collapse: ${getBorderType};
    background: transparent;
    font-size: 1.6rem;

    .table-header {
      background: ${(props) => (props?.v1 ? '#1C1C28' : '#171722')};

      .table-head {
        &:first-of-type {
          padding-left: var(--padding-left);
        }
        .MuiTableSortLabel-root:hover,
        .MuiTableSortLabel-icon:hover {
          color: white;
        }
        .Mui-active {
          color: #c3c2d4;
          .MuiTableSortLabel-icon {
            color: #c3c2d4;
          }
        }
      }

      .table-row-head {
        border-radius: 0px;
      }

      th {
        text-transform: capitalize;
        font-size: 1.6rem;
        font-weight: 400;
        color: var(--text-6);
        border: none;
        background: #171722;
        padding: 1vw 3vw;

        &:first-of-type {
          padding-left: 0.6rem;
          border-radius: var(--border-radius) 0 0 var(--border-radius);
        }
        &:last-of-type {
          padding-right: 0.6rem;
          border-radius: 0 var(--border-radius) var(--border-radius) 0;
        }
        &:hover {
          color: white;
        }
        @media (max-width: 1300px) {
          border-radius: none;
        }
      }
    }
    .table-body {
      .table-row {
        --selected-row-border: none;
        background: #171722;
        border-top: 3px solid #1C1C28;
        transition: 200ms;
        font-size: 1.6rem;
        cursor: pointer;
        &:hover {
          backdrop-filter: brightness(1.25);
          filter: brightness(1.25);
          color: white;
        }
        &.active {
          --selected-row-border: 5px solid var(--primary);
        }
        &.blured {
          opacity: 0.46;
        }
        &.highlight {
          background: var(--bg-4);
        }

        &.skel {
          background: transparent;
        }
        &.disable-animation {
          &:hover {
            transform: scaleX(1);
          }
        }

        .skel-cell {
          padding: 0;
          margin: 0;
          border-bottom: none;
          border-top: none;
          .skel {
            background-color: var(--bg-8);
            width: 100%;
            height: 18rem;
            border-radius: 1rem;
            margin-top: -3.8rem;
          }
        }
        .table-cell {
          color: rgb(195, 194, 212);
          border-top: none;
          font-size: 1.4rem;
          border-bottom: ${getBorder};
          padding: 1vw 2vw;

          &.double-height {
            height: 50px;
          }
          &.sm {
            padding: 1.7rem 0;
          }
          &:first-of-type {
            padding-left: var(--padding-left);
          }
          &:last-of-type {
            padding-right: calc(var(--padding-left) - 1rem);
          }
        }
        &:hover {
          .table-cell {
            color: white;
          }
        }
      }
      .transparent-hover {
        &:hover {
          background: var(--bg-19);
        }
        &.active {
          background: var(--bg-19);
          --selected-row-border: none;
        }
        &.blured {
          opacity: 1;
        }
      }
    }
    .fotter-bg {
      background-color: white;
      display: flex;
    }
  }
`;

import {
    Skeleton,
    Table,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TableSortLabel,
    TableBody,
} from '@mui/material';
import { ReactNode, useMemo, useState } from 'react';
import Background from 'src/AppStyles';
import { Section } from "@Views/Common/Card/Section";
import { BlueBtn } from "@Views/Common/V2-Button";
import BufferInput from "@Views/Common/BufferInput";
import { BorderAll } from "@mui/icons-material";
import { useAtom } from "jotai";

const createArray: (n: number) => number[] = (n) => Array.apply(0, new Array(n)).map((i, idx) => idx)


function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

type Order = 'asc' | 'desc';

function getComparator<Key extends keyof any>(
    order: Order,
    orderBy: Key
): (
    a: { [key in Key]: number | string },
    b: { [key in Key]: number | string }
) => number {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

interface HeadCell {
    id: string;
    label: string;
}

export default function PoolListTable({
    headerJSX,
    bodyJSX,
    loading,
    isBodyTransparent = false,
    shouldHideBody = false,
    cols,
    rows,
    selectedIndex,
    bluredIndexes,
    onRowClick,
    widths,
    error,
    data,
    defaultSortId,
    defaultOrder = 'asc',
    shouldShowMobile = false,
}: {
    data: any[];
    headerJSX: HeadCell[];
    bodyJSX: (row: number, col: number, sortedData: any[]) => React.ReactChild;
    loading?: boolean;
    isBodyTransparent?: boolean;
    shouldHideBody?: boolean;
    cols: number;
    rows: number;
    selectedIndex?: number;
    bluredIndexes?: number[];
    onRowClick: (idx: number) => void;
    widths?: string[];
    error?: ReactNode;
    defaultSortId: string;
    defaultOrder?: Order;
    shouldShowMobile?: boolean;
}) {
    const [poolsState, setPoolsState] = useAtom(poolsAtom);
    const [order, setOrder] = useState<Order>(defaultOrder);
    const [orderBy, setOrderBy] = useState<string>(defaultSortId);
    const [page, setPage] = useState(1);
    const [numPages, setNumPages] = useState(Math.ceil(data.length / rows))
    const [filterStatus, setFilter] = useState({ tokenA: "", tokenB: "", aprMin: 0, network: "", protocol: "", tvlMin: 0, volumeMin: 0, feesMin: 0 })
    /*if (poolsState.auxModalData && poolsState.auxModalData.filter) {
        setFilter(poolsState.auxModalData.filter);
    }*/


    const handleRequestSort = (property: string) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
        setPage(1);
    };
    const sortedData = useMemo(
        () => {
            const filtered = data.filter(p => {
                //console.log("FILTER", filterStatus.tokenA, p.Pool);
                return (filterStatus.tokenA == "" || p.TokenA.indexOf(filterStatus.tokenA) >= 0) &&
                    (filterStatus.tokenB == "" || p.TokenB.indexOf(filterStatus.tokenB) >= 0) &&
                    (filterStatus.aprMin == 0 || p.APR >= filterStatus.aprMin) &&
                    (filterStatus.network == "" || p.Chain.indexOf(filterStatus.network) >= 0) &&
                    (filterStatus.protocol == "" || p.Protocol.indexOf(filterStatus.protocol) >= 0) &&
                    (filterStatus.tvlMin == 0 || p.TVL >= filterStatus.tvlMin) &&
                    (filterStatus.volumeMin == 0 || p.Volume >= filterStatus.volumeMin) &&
                    (filterStatus.feesMin == 0 || p.Fees >= filterStatus.feesMin)
            })
            setNumPages(Math.ceil(filtered.length / rows));
            const sorted = filtered.sort(getComparator(order, orderBy));
            return sorted.slice((page - 1) * rows);
        },
        [data, order, orderBy, page, filterStatus]
    );
    //console.log("sortedData", order, orderBy, sortedData);
    if (sortedData.length < rows)
        rows = sortedData.length;

    let rowClass = '';
    let tableCellCls = 'table-cell';
    const classPagers = "w-[40px] min-w-[40px] h-[25px]";

    return (
        <TableBackground shouldShowMobile={shouldShowMobile && window.innerWidth < 1200}>
            <div className="a1200:!hidden flex text-f16">
                <BlueBtn onClick={() => { setPoolsState({ ...poolsState, isModalOpen: true, activeModal: "FILTER", auxModalData: { filter: filterStatus, setFilter: setFilter } }) }} className="w-[65px] mb-5">Filter</BlueBtn>
            </div>
            <div className="text-f16 m-auto mb-5 flex w-[60vw] mt-5 b1200:!hidden">
                <div className="h-[100%] pt-[20px] ">Filter: &nbsp;&nbsp;</div>
                <BufferInput
                    placeholder={"Token A"}
                    className="w-[100px] min-w-[100px] h-[60px] ml-[20px]"
                    bgClass="!bg-2"
                    ipClass="mt-1"
                    value={filterStatus.tokenA}
                    onChange={(val) => {
                        setFilter({ ...filterStatus, tokenA: val });
                    }}
                />
                <BufferInput
                    placeholder={"Token B"}
                    className="w-[100px] min-w-[100px] h-[60px] ml-[20px]"
                    bgClass="!bg-2"
                    ipClass="mt-1"
                    value={filterStatus.tokenB}
                    onChange={(val) => {
                        setFilter({ ...filterStatus, tokenB: val });
                    }}
                />
                <BufferInput
                    placeholder={"Network"}
                    className="w-[100px] min-w-[100px] h-[60px] ml-[20px]"
                    bgClass="!bg-2"
                    ipClass="mt-1"
                    value={filterStatus.network}
                    onChange={(val) => {
                        setFilter({ ...filterStatus, network: val });
                    }}
                />
                <BufferInput
                    placeholder={"Protocol"}
                    className="w-[100px] min-w-[100px] h-[60px] ml-[20px]"
                    bgClass="!bg-2"
                    ipClass="mt-1"
                    value={filterStatus.protocol}
                    onChange={(val) => {
                        setFilter({ ...filterStatus, protocol: val });
                    }}
                />

                <BufferInput
                    placeholder={"Min. TVL"}
                    className="w-[120px] min-w-[100px]  h-[60px] ml-[20px]"
                    bgClass="!bg-2"
                    ipClass="mt-1"
                    value={filterStatus.tvlMin ? filterStatus.tvlMin.toString() : ""}
                    onChange={(val) => {
                        if (!isNaN(val))
                            setFilter({ ...filterStatus, tvlMin: Number(val) });
                    }}
                />
                <BufferInput
                    placeholder={"Min. Vol"}
                    className="w-[120px] min-w-[100px]  h-[60px] ml-[20px]"
                    bgClass="!bg-2"
                    ipClass="mt-1"
                    value={filterStatus.volumeMin ? filterStatus.volumeMin.toString() : ""}
                    onChange={(val) => {
                        if (!isNaN(val))
                            setFilter({ ...filterStatus, volumeMin: Number(val) });
                    }}
                />
                <BufferInput
                    placeholder={"Min. Fees"}
                    className="w-[120px] min-w-[100px]  h-[60px] ml-[20px]"
                    bgClass="!bg-2"
                    ipClass="mt-1"
                    value={filterStatus.feesMin ? filterStatus.feesMin.toString() : ""}
                    onChange={(val) => {
                        if (!isNaN(val))
                            setFilter({ ...filterStatus, feesMin: Number(val) });
                    }}
                />


            </div>
            <TableContainer>
                <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
                    <TableHead className={`table-header`}>
                        <TableRow className={`table-row-head`}>
                            {headerJSX.map((headCell) => (
                                <TableCell key={headCell.id} className="table-head" align={"center"}>
                                    <TableSortLabel
                                        active={orderBy === headCell.id}
                                        direction={orderBy === headCell.id ? order : 'asc'}
                                        onClick={() => handleRequestSort(headCell.id)}
                                    >
                                        {headCell.label}
                                    </TableSortLabel>
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody className="table-body">
                        {loading ? (
                            <TableRow
                                className={`table-row skel ${isBodyTransparent ? 'transparent transparent-hover' : ''
                                    }`}
                            >
                                <TableCell className="skel-cell" colSpan={100}>
                                    <Skeleton className="skel" />
                                </TableCell>
                            </TableRow>
                        ) : shouldHideBody ? (
                            <></>
                        ) : rows ? (
                            createArray(rows).map((row, rowIdx) => {
                                let rowClass = '';
                                if (selectedIndex === rowIdx) {
                                    rowClass = 'active';
                                } else if (
                                    selectedIndex !== null &&
                                    selectedIndex !== undefined
                                ) {
                                    rowClass = 'blured';
                                }
                                if (bluredIndexes && bluredIndexes.length) {
                                    for (let i of bluredIndexes) {
                                        if (row === i) {
                                            rowClass = 'blured';
                                        }
                                    }
                                }
                                return (
                                    <TableRow
                                        key={row}
                                        className={`table-row ${rowClass} ${isBodyTransparent ? 'transparent transparent-hover' : ''
                                            }`}
                                        onClick={() => onRowClick(row)}
                                    >
                                        {createArray(cols).map((col, colIdx) => (
                                            <TableCell
                                                key={row.toString() + colIdx}
                                                className={tableCellCls}
                                                width={
                                                    widths && colIdx < widths.length ? widths[colIdx] : ''
                                                }
                                                align={headerJSX[col].align}
                                            >
                                                {bodyJSX(row, col, sortedData)}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                );
                            })
                        ) : (
                            <TableRow
                                className={`table-row ${rowClass}  disable-animation ${isBodyTransparent ? 'transparent' : ''
                                    }`}
                            >
                                <TableCell className={tableCellCls} colSpan={100}>
                                    {error}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <div className="m-auto w-[300px] justify-center h-[40px] flex text-f16 mt-5">
                <div className="mt-[7px] mr-5">
                    Page
                </div>
                {page > 1 && <BlueBtn className={classPagers} onClick={() => { setPage(page - 1) }}>&lt;&lt;</BlueBtn>}
                <BufferInput
                    className="w-[60px] min-w-[60px] ml-5"
                    numericValidations={{
                        decimals: { val: 0 },
                        max: { val: numPages.toString(), error: "" },
                        min: { val: "1", error: "" },
                    }}
                    placeholder={page.toString()}
                    bgClass="!bg-1"
                    ipClass="mt-1"
                    value={page.toString()}
                    onChange={(val) => {
                        if (!isNaN(val)) {
                            const numVal = Number(val);
                            if (numVal >= 1 && numVal <= numPages)
                                setPage(numVal);
                        }
                    }}
                />

                {page < numPages && <BlueBtn className={classPagers + " ml-5"} onClick={() => { setPage(page + 1) }}>&gt;&gt;</BlueBtn>}

                <div className="mt-[7px] ml-5">
                    of {numPages}
                </div>
            </div>
        </TableBackground >
    );
}

export const PoolsTable = ({ data }: { data: IPoolsData }) => {
    //console.log("PoolsTable data", data);
    if (!data || !data.pools || data.pools.length == 0) {
        return <Skeleton
            key="PoolsTable"
            variant="rectangular"
            className="w-full !h-full min-h-[370px] !transform-none !bg-1"
        />
    }
    else {
        const headerJSX = [
            { id: "Pool", label: "Pool", unit: "", align: "center", precision: undefined },
            { id: "APR", label: "APR", unit: "%", align: "center", precision: 0 },
            { id: "Chain", label: "Network", unit: "", align: "center", precision: undefined },
            { id: "Protocol", label: "Protocol", unit: "", align: "center", precision: undefined },
            { id: "TVL", label: "TVL", unit: "$", align: "center", precision: 0 },
            { id: "Volume", label: "Volume", unit: "$", align: "center", precision: 0 },
            { id: "Fees", label: "Fees", unit: "$", align: "center", precision: 0 },
            { id: "VolTVL", label: "Vol / TVL", unit: "", align: "center", precision: 2 },
        ];

        const dashboardData = data.pools.map(p => {
            return {
                Pool: p.BaseToken + " / " + p.QuoteToken,
                APR: p.apr,
                Chain: p.ChainId,
                Protocol: p.DexId,
                TVL: p.Liquidity,
                Volume: p.Volume,
                Fees: p.fees,
                VolTVL: p.Volume / p.Liquidity,
                TokenA: p.BaseToken,
                TokenB: p.QuoteToken
            }
        });
        //console.log("dashboardData", dashboardData);

        interface ICellContent {
            content: ReactNode[];
            className?: string;
            classNames?: string[];
            preventDefault?: boolean;
        }

        const CellContent: React.FC<ICellContent> = ({ content, classNames, preventDefault, className, }) => {

            if (!content.length) return <></>;
            return (
                <div className={`${className} flex flex-col`}>
                    {content.map((cellInfo, key) => {
                        return (
                            <span
                                className={`${classNames && classNames?.length >= key ? classNames[key] : null} ${key && !preventDefault && " text-4 "
                                    }`}
                                key={key}
                            >
                                {cellInfo}
                            </span>
                        );
                    })}
                </div>
            );
        };

        const bodyJSX = (
            row: number,
            col: number,
            sortedData: typeof dashboardData
        ) => {
            const rowData = sortedData[row];
            const keys = Object.keys(rowData);
            const currentData = sortedData[row][keys[col]];

            //console.log("currentData", currentData);
            return <CellContent
                content={[
                    <Display
                        data={currentData}
                        unit={headerJSX[col].unit}
                        precision={headerJSX[col].precision}
                    />,
                ]}
            />;
        }


        return <>
            <div id="PoolListTableContainer" className="m-auto w-[90vw]">
                <PoolListTable
                    defaultSortId="APR"
                    defaultOrder="desc"
                    headerJSX={headerJSX}
                    cols={headerJSX.length}
                    data={dashboardData}
                    rows={Math.min(dashboardData?.length, 10)}
                    bodyJSX={bodyJSX}
                    loading={!dashboardData.length}
                    onRowClick={(idx) => {
                        //navigate(`/binary/${dashboardData[idx].pair}`);
                    }}
                    widths={['12%', '12%', '12%', '12%', '14%', '14%', '12%', '12%']}
                    shouldShowMobile={true}
                />
            </div>
        </>;
    }
}