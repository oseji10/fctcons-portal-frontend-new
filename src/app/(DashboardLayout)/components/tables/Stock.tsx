import {
    Typography, Box,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Button,
    TextField,
    Modal,
    IconButton,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
} from '@mui/material';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';
import { useEffect, useState } from "react";
import api from '../../../../lib/api';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

interface Product {
    productId: string;
    productName: string;
}

interface Stock {
    stockId: string;
    stockName: string;
    productId: string;
    quantityReceived: number;
    quantitySold: number;
    quantityTransferred: number;
    quantityAvailable: number;
}

const Stocks = () => {
    const [stocks, setStocks] = useState<Stock[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [openModal, setOpenModal] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState("");
    const [quantityReceived, setQuantityReceived] = useState("");
    const [editingStock, setEditingStock] = useState<Stock | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [stockToDelete, setStockToDelete] = useState<Stock | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                // Fetch stocks
                const stockResponse = await api.get('/stock');
                const transformedData = stockResponse.data.map((item: any) => ({
                    stockId: String(item.stockId),
                    stockName: item.product?.productName || 'Unknown Product',
                    productId: String(item.productId),
                    quantityReceived: item.quantityReceived || 0,
                    quantitySold: item.quantitySold || 0,
                    quantityTransferred: item.quantityTransferred || 0,
                    quantityAvailable: item.quantityAvailable || 0
                }));
                const sortedData = transformedData.sort((a: Stock, b: Stock) => 
                    a.stockName.localeCompare(b.stockName)
                );
                setStocks(sortedData);

                // Fetch products for dropdown
                const productResponse = await api.get('/products');
                setProducts(productResponse.data.map((item: any) => ({
                    productId: String(item.productId),
                    productName: item.productName
                })));
            } catch (error: any) {
                setError(error.response?.data?.message || 'Failed to fetch data');
                console.error('Fetch error:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleOpenModal = (stock?: Stock) => {
        if (stock) {
            setEditingStock(stock);
            setSelectedProductId(stock.productId);
            setQuantityReceived(stock.quantityReceived.toString());
        } else {
            setEditingStock(null);
            setSelectedProductId("");
            setQuantityReceived("");
        }
        setError(null);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedProductId("");
        setQuantityReceived("");
        setEditingStock(null);
        setError(null);
        setIsSubmitting(false);
    };

    const handleSubmit = async () => {
        if (!selectedProductId) {
            setError('Product name is required');
            setIsSubmitting(false);
            return;
        }
        if (!quantityReceived || isNaN(Number(quantityReceived)) || Number(quantityReceived) <= 0) {
            setError('Valid quantity is required');
            setIsSubmitting(false);
            return;
        }

        setIsSubmitting(true);
        try {
            let newStock: Stock;
            const payload = { 
                productId: selectedProductId,
                quantityReceived: Number(quantityReceived)
            };
            if (editingStock) {
                const response = await api.put(`/stock/${editingStock.stockId}/edit`, payload);
                if (response.status >= 200 && response.status < 300) {
                    newStock = {
                        ...response.data,
                        stockId: String(response.data.stockId),
                        stockName: response.data.product?.productName || 'Unknown Product',
                        productId: String(response.data.productId),
                        quantityReceived: response.data.quantityReceived || 0,
                        quantitySold: response.data.quantitySold || 0,
                        quantityTransferred: response.data.quantityTransferred || 0,
                        quantityAvailable: response.data.quantityAvailable || 0
                    };
                    const updatedStocks = stocks.map(m => 
                        m.stockId === editingStock.stockId ? newStock : m
                    ).sort((a, b) => a.stockName.localeCompare(b.stockName));
                    setStocks(updatedStocks);
                    setError(null);
                    handleCloseModal();
                } else {
                    throw new Error(response.data?.message || 'Update failed');
                }
            } else {
                const response = await api.post('/stock', payload);
                if (response.status >= 200 && response.status < 300) {
                    newStock = {
                        ...response.data,
                        stockId: String(response.data.stockId),
                        stockName: response.data.product?.productName || 'Unknown Product',
                        productId: String(response.data.productId),
                        quantityReceived: response.data.quantityReceived || 0,
                        quantitySold: response.data.quantitySold || 0,
                        quantityTransferred: response.data.quantityTransferred || 0,
                        quantityAvailable: response.data.quantityAvailable || 0
                    };
                    const updatedStocks = [...stocks, newStock].sort((a, b) => 
                        a.stockName.localeCompare(b.stockName));
                    setStocks(updatedStocks);
                    setError(null);
                    handleCloseModal();
                } else {
                    throw new Error(response.data?.message || 'Add failed');
                }
            }
        } catch (error: any) {
            setError(
                error.response?.data?.message || 
                error.message || 
                (editingStock ? 'Error updating stock' : 'Error adding stock')
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleOpenDeleteDialog = (stock: Stock) => {
        setStockToDelete(stock);
        setDeleteDialogOpen(true);
    };

    const handleCloseDeleteDialog = () => {
        setDeleteDialogOpen(false);
        setStockToDelete(null);
        setError(null);
    };

    const handleDelete = async () => {
        if (!stockToDelete) return;

        setIsSubmitting(true);
        try {
            const response = await api.delete(`/stock/${stockToDelete.stockId}/delete`);
            if (response.status >= 200 && response.status < 300) {
                const updatedStocks = stocks.filter(m => 
                    m.stockId !== stockToDelete.stockId
                ).sort((a, b) => a.stockName.localeCompare(b.stockName));
                setStocks(updatedStocks);
                setError(null);
                handleCloseDeleteDialog();
            } else {
                throw new Error(response.data?.message || 'Delete failed');
            }
        } catch (error: any) {
            setError(
                error.response?.data?.message || 
                error.message || 
                'Failed to delete stock'
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <DashboardCard title="Stocks List">
            <Box mb={2}>
                <Button
                    variant="contained"
                    onClick={() => handleOpenModal()}
                    disableElevation
                    color="primary"
                    disabled={isLoading}
                >
                    Add Stock
                </Button>
            </Box>

            {error && (
                <Box mb={2}>
                    <Typography color="error">{error}</Typography>
                </Box>
            )}

            {isLoading ? (
                <Box display="flex" justifyContent="center" my={4}>
                    <CircularProgress />
                </Box>
            ) : (
                <Box sx={{ overflow: 'auto', width: { xs: '280px', sm: 'auto' } }}>
                    <Table
                        aria-label="stocks table"
                        sx={{
                            whiteSpace: "nowrap",
                            mt: 2
                        }}
                    >
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    <Typography variant="subtitle2" fontWeight={600}>
                                        Stock Name
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="subtitle2" fontWeight={600}>
                                        Quantity Received
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="subtitle2" fontWeight={600}>
                                        Quantity Sold
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="subtitle2" fontWeight={600}>
                                        Quantity Transferred
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="subtitle2" fontWeight={600}>
                                        Quantity Available
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="subtitle2" fontWeight={600}>
                                        Actions
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {stocks.map((stock) => (
                                <TableRow key={stock.stockId}>
                                    <TableCell>
                                        <Typography
                                            sx={{
                                                fontSize: "15px",
                                                fontWeight: "500",
                                            }}
                                        >
                                            {stock.stockName}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography sx={{ fontSize: "15px" }}>
                                            {stock.quantityReceived}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography sx={{ fontSize: "15px" }}>
                                            {stock.quantitySold}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography sx={{ fontSize: "15px" }}>
                                            {stock.quantityTransferred}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography sx={{ fontSize: "15px" }}>
                                            {stock.quantityAvailable}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <IconButton onClick={() => handleOpenModal(stock)}>
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton 
                                            onClick={() => handleOpenDeleteDialog(stock)}
                                            disabled={isSubmitting}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Box>
            )}

            <Modal
                open={openModal}
                onClose={handleCloseModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: { xs: '90%', sm: 400 },
                    maxWidth: '95%',
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: { xs: 2, sm: 4 },
                    borderRadius: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                }}>
                    <Typography id="modal-modal-title" variant="h6" component="h2" fontWeight={600}>
                        {editingStock ? 'Edit Stock' : 'Add New Stock'}
                    </Typography>
                    <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <FormControl fullWidth variant="outlined" error={!!error}>
                            <InputLabel>Product Name</InputLabel>
                            <Select
                                value={selectedProductId}
                                onChange={(e) => setSelectedProductId(e.target.value)}
                                label="Product Name"
                                disabled={isSubmitting}
                            >
                                <MenuItem value="">
                                    <em>Select a product</em>
                                </MenuItem>
                                {products.map((product) => (
                                    <MenuItem key={product.productId} value={product.productId}>
                                        {product.productName}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <TextField
                            fullWidth
                            label="Quantity Received"
                            value={quantityReceived}
                            onChange={(e) => setQuantityReceived(e.target.value)}
                            error={!!error}
                            helperText={error}
                            disabled={isSubmitting}
                            variant="outlined"
                            type="number"
                        />
                        {error && (
                            <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                                {error}
                            </Typography>
                        )}
                        <Box display="flex" justifyContent="flex-end" gap={1} sx={{ mt: 2 }}>
                            <Button 
                                onClick={handleCloseModal} 
                                color="secondary"
                                disabled={isSubmitting}
                                variant="outlined"
                            >
                                Cancel
                            </Button>
                            <Button 
                                onClick={handleSubmit} 
                                variant="contained" 
                                color="primary"
                                disabled={isSubmitting || !selectedProductId || !quantityReceived}
                                startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}
                            >
                                {isSubmitting ? (editingStock ? 'Updating...' : 'Adding...') : (editingStock ? 'Update' : 'Add')}
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </Modal>

            <Dialog
                open={deleteDialogOpen}
                onClose={handleCloseDeleteDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    Confirm Deletion
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to delete the stock "{stockToDelete?.stockName}"? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteDialog} disabled={isSubmitting}>
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleDelete} 
                        color="error" 
                        variant="contained"
                        disabled={isSubmitting}
                        startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}
                    >
                        {isSubmitting ? 'Deleting...' : 'Delete'}
                    </Button>
                </DialogActions>
            </Dialog>
        </DashboardCard>
    );
};

export default Stocks;