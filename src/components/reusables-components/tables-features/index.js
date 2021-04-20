import { useState } from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import { TableSortLabel, TableRow, TableCell, TablePagination, TableHead } from '@material-ui/core'
const useStyles = makeStyles((theme) => ({
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  }
}));
const StyledTableSortLabel = withStyles((theme) =>
    ({
      root: {
        color: 'white',
        "&:hover": {
          color: 'white',
        },
        '&$active': {
          color: 'white',
        },
      },
      active: {},
      icon: {
        color: 'inherit !important'
      }}))(TableSortLabel);
/**
 * Método encargado de administrar el estado del sorting de columnas
 * Regresa variables de estado y métodos necesarios.
 * El parametro upDown recibe el ordenamiento "asc"/"desc"
 * El parámetro column recibe la columna a ordernar
 */
export const SortableTableState=(upDown, column)=>{
    const [order, setOrder] = useState(upDown);
    const [orderBy, setOrderBy] = useState(column);

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const stableSort=(array, comparator)=> {
      const stabilizedThis = array.map((el, index) => [el, index]);
      stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
      });
      return stabilizedThis.map((el) => el[0]);
    };
    
    const descendingComparator=(a, b, orderBy)=> {
      if (b[orderBy] < a[orderBy]) {
        return -1;
      }
      if (b[orderBy] > a[orderBy]) {
        return 1;
      }
      return 0;
    }
    const getComparator=(order, orderBy)=> {
      return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
    }
    return { order, setOrder, orderBy, setOrderBy, handleRequestSort, stableSort, getComparator };
}

/**
 * Regresa header con columnas ordenables ascendente y descendente
 */
export function SortableTableHead(props) {
    const classes=useStyles();
    const { order, orderBy, onRequestSort, headCells } = props;
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };
      return (
          <TableHead>
            <DarkTableRow>
              {headCells.map((headCell) => (
                <DarkTableCell
                  key={headCell.id}
                  align={headCell.align}
                  padding={headCell.disablePadding ? 'none' : 'default'}
                  sortDirection={orderBy === headCell.id ? order : false}
                >
                  {headCell.label && 
                  <StyledTableSortLabel
                    active={orderBy === headCell.id}
                    direction={orderBy === headCell.id ? order : 'asc'}
                    onClick={createSortHandler(headCell.id)}
                  >
                    {headCell.label}
                    {orderBy === headCell.id ? (
                      <span className={classes.visuallyHidden}>
                        {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                      </span>
                    ) : null}
                  </StyledTableSortLabel>
                }     
                </DarkTableCell>
              ))}
            </DarkTableRow>
          </TableHead>
        );
      }

export const DarkTableRow = withStyles((theme) => ({
    root: {
        '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
        fontSize: 14,
        },

    },
    }))(TableRow);
export const DarkTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
        fontSize: 20,
    },
    body: {
        fontSize: 18,
    },
    }))(TableCell);
export const ManagePagination=()=>{
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [page, setPage] = useState(0);

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
        };
    
        const handleChangePage = (event, newPage) => {
        setPage(newPage);
        };
        return {rowsPerPage, page, handleChangeRowsPerPage, handleChangePage}
    }
export const TablePaginationCustom=(rows, rowsPerPage, page, handleChangePage, handleChangeRowsPerPage)=>{
    /**
        Reutilización de componente para paginado
        */
    return (
        <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={rows ? rows.length : 0 }
                        rowsPerPage={rows ? rowsPerPage : 0}
                        page={page}
                        onChangePage={handleChangePage}
                        onChangeRowsPerPage={handleChangeRowsPerPage} />
    );
}