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
    InputLabel,
    FormControl,
    Chip,
} from '@mui/material';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';
import { useEffect, useState } from "react";
import api from '../../../../lib/api';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddIcon from '@mui/icons-material/Add';

interface Product {
    productId: string;
    productName: string;
}

interface ProductRequest {
    productrequestId: string;
    productId: string;
    requestDate: string;
    quantityRequested: number;
    quantityDispatched: number;
    quantityReceived: number;
    approvedBy?: string;
    batchNumber?: string;
    status?: string;
}

const ProductRequests = () => {
    const [productrequests, setProductRequests] = useState<ProductRequest[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [openAddModal, setOpenAddModal] = useState(false);
    const [openViewModal, setOpenViewModal] = useState(false);
    const [selectedProducts, setSelectedProducts] = useState<{ productId: string; quantity: number }[]>([]);
    const [selectedProductId, setSelectedProductId] = useState('');
    const [quantityRequested, setQuantity] = useState('');
    const [viewingRequest, setViewingRequest] = useState<ProductRequest | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [productrequestToDelete, setProductRequestToDelete] = useState<ProductRequest | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const [requestsResponse, productsResponse] = await Promise.all([
                    api.get('/product-request'),
                    api.get('/products')
                ]);
                const sortedRequests = requestsResponse.data.sort((a: ProductRequest, b: ProductRequest) => 
                    new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime()
                );
                setProductRequests(sortedRequests);
                setProducts(productsResponse.data);
            } catch (error: any) {
                setError(error.response?.data?.message || 'Failed to fetch data');
                console.error('Fetch error:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleOpenAddModal = () => {
        setSelectedProducts([]);
        setSelectedProductId('');
        setQuantity('');
        setError(null);
        setOpenAddModal(true);
    };

    const handleCloseAddModal = () => {
        setOpenAddModal(false);
        setSelectedProducts([]);
        setSelectedProductId('');
        setQuantity('');
        setError(null);
        setIsSubmitting(false);
    };

    const handleAddToCart = () => {
        if (!selectedProductId || !quantityRequested || isNaN(Number(quantityRequested)) || Number(quantityRequested) <= 0) {
            setError('Please select a product and enter a valid quantity');
            return;
        }
        const product = products.find(p => p.productId === selectedProductId);
        if (product) {
            setSelectedProducts([...selectedProducts, { productId: selectedProductId, quantityRequested: Number(quantityRequested) }]);
            setSelectedProductId('');
            setQuantity('');
            setError(null);
        }
    };

    const handleRemoveFromCart = (productId: string) => {
        setSelectedProducts(selectedProducts.filter(p => p.productId !== productId));
    };

    const handleSubmitRequest = async () => {
        if (selectedProducts.length === 0) {
            setError('Please add at least one product to the request');
            return;
        }

        setIsSubmitting(true);
        try {
            const payload = { products: selectedProducts };
            const response = await api.post('/product-request', payload);
            if (response.status >= 200 && response.status < 300) {
                const newRequest = response.data;
                setProductRequests([newRequest, ...productrequests].sort((a, b) => 
                    new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime()
                ));
                handleCloseAddModal();
            } else {
                throw new Error(response.data?.message || 'Request submission failed');
            }
        } catch (error: any) {
            setError(error.response?.data?.message || 'Failed to submit request');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleOpenViewModal = (request: ProductRequest) => {
        setViewingRequest(request);
        setOpenViewModal(true);
    };

    const handleCloseViewModal = () => {
        setOpenViewModal(false);
        setViewingRequest(null);
    };

    const handleOpenDeleteDialog = (productrequest: ProductRequest) => {
        setProductRequestToDelete(productrequest);
        setDeleteDialogOpen(true);
    };

    const handleCloseDeleteDialog = () => {
        setDeleteDialogOpen(false);
        setProductRequestToDelete(null);
        setError(null);
    };

    const handleDelete = async () => {
        if (!productrequestToDelete) return;

        setIsSubmitting(true);
        try {
            const response = await api.delete(`/product-request/${productrequestToDelete.productrequestId}/delete`);
            if (response.status >= 200 && response.status < 300) {
                setProductRequests(productrequests.filter(m => 
                    m.productrequestId !== productrequestToDelete.productrequestId
                ));
                handleCloseDeleteDialog();
            } else {
                throw new Error(response.data?.message || 'Delete failed');
            }
        } catch (error: any) {
            setError(error.response?.data?.message || 'Failed to delete request');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <DashboardCard title="Product Requests">
            <Box mb={2}>
                <Button
                    variant="contained"
                    onClick={handleOpenAddModal}
                    disableElevation
                    color="primary"
                    disabled={isLoading}
                    startIcon={<AddIcon />}
                >
                    Request Products
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
                        aria-label="product requests table"
                        sx={{
                            whiteSpace: "nowrap",
                            mt: 2
                        }}
                    >
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    <Typography variant="subtitle2" fontWeight={600}>
                                        Product Name
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="subtitle2" fontWeight={600}>
                                        Request Date
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="subtitle2" fontWeight={600}>
                                        Quantity Requested
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="subtitle2" fontWeight={600}>
                                        Quantity Dispatched
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="subtitle2" fontWeight={600}>
                                        Quantity Received
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
                            {productrequests.map((request) => (
                                <TableRow key={request.productrequestId}>
                                    <TableCell>
                                        <Typography sx={{ fontSize: "15px", fontWeight: "500" }}>
                                            {request.productName}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography sx={{ fontSize: "15px" }}>
                                            {new Date(request.requestDate).toLocaleDateString()}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography sx={{ fontSize: "15px" }}>
                                            {request.quantityRequested}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography sx={{ fontSize: "15px" }}>
                                            {request.quantityDispatched}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography sx={{ fontSize: "15px" }}>
                                            {request.quantityReceived}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <IconButton onClick={() => handleOpenViewModal(request)}>
                                            <VisibilityIcon />
                                        </IconButton>
                                        <IconButton 
                                            onClick={() => handleOpenDeleteDialog(request)}
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
                open={openAddModal}
                onClose={handleCloseAddModal}
                aria-labelledby="add-request-modal-title"
            >
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: { xs: '90%', sm: 600 },
                    maxWidth: '95%',
                    bgcolor: 'background.paper',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                    p: { xs: 3, sm: 4 },
                    borderRadius: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 3,
                    maxHeight: '90vh',
                    overflowY: 'auto',
                }}>
                    <Typography id="add-request-modal-title" variant="h5" fontWeight={700} color="primary">
                        Create New Product Request
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                            <FormControl sx={{ flex: 1, minWidth: 200 }}>
                                <InputLabel>Select Product</InputLabel>
                                <Select
                                    value={selectedProductId}
                                    onChange={(e) => setSelectedProductId(e.target.value)}
                                    label="Select Product"
                                >
                                    {products.map((product) => (
                                        <MenuItem key={product.productId} value={product.productId}>
                                            {product.productName}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <TextField
                                label="Quantity"
                                type="number"
                                value={quantityRequested}
                                onChange={(e) => setQuantity(e.target.value)}
                                sx={{ flex: 1, minWidth: 120 }}
                                error={!!error && !quantityRequested}
                                disabled={isSubmitting}
                            />
                            <Button
                                variant="outlined"
                                onClick={handleAddToCart}
                                disabled={isSubmitting}
                                sx={{ height: '56px' }}
                            >
                                Add to Cart
                            </Button>
                        </Box>
                        {selectedProducts.length > 0 && (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, p: 2, bgcolor: 'grey.100', borderRadius: 2 }}>
                                {selectedProducts.map((item) => {
                                    const product = products.find(p => p.productId === item.productId);
                                    return (
                                        <Chip
                                            key={item.productId}
                                            label={`${product?.productName} (Qty: ${item.quantity})`}
                                            onDelete={() => handleRemoveFromCart(item.productId)}
                                            sx={{ bgcolor: 'primary.dark', color: 'primary.contrastText' }}
                                        />
                                    );
                                })}
                            </Box>
                        )}
                        {error && (
                            <Typography color="error" variant="body2">
                                {error}
                            </Typography>
                        )}
                        <Box display="flex" justifyContent="flex-end" gap={2}>
                            <Button 
                                onClick={handleCloseAddModal} 
                                variant="outlined"
                                disabled={isSubmitting}
                                sx={{ 
                                    borderColor: 'grey.400', 
                                    color: 'grey.700',
                                    '&:hover': { borderColor: 'grey.600', bgcolor: 'grey.100' }
                                }}
                            >
                                Cancel
                            </Button>
                            <Button 
                                onClick={handleSubmitRequest} 
                                variant="contained" 
                                color="primary"
                                disabled={isSubmitting || selectedProducts.length === 0}
                                startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <AddIcon />}
                                sx={{
                                    bgcolor: 'primary.main',
                                    '&:hover': { bgcolor: 'primary.dark' }
                                }}
                            >
                                {isSubmitting ? 'Submitting...' : 'Place Request'}
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </Modal>

            <Modal
                open={openViewModal}
                onClose={handleCloseViewModal}
                aria-labelledby="view-request-modal-title"
            >
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: { xs: '90%', sm: 500 },
                    maxWidth: '95%',
                    bgcolor: 'background.paper',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                    p: { xs: 3, sm: 4 },
                    borderRadius: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 3,
                }}>
                    <Typography id="view-request-modal-title" variant="h5" fontWeight={700} color="primary">
                        Request Details
                    </Typography>
                    {viewingRequest && (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Box sx={{ bgcolor: 'grey.100', p: 2, borderRadius: 2 }}>
                                <Typography variant="subtitle1" fontWeight={600}>Product Name</Typography>
                                <Typography>{viewingRequest.productName}</Typography>
                            </Box>
                            <Box sx={{ bgcolor: 'grey.100', p: 2, borderRadius: 2 }}>
                                <Typography variant="subtitle1" fontWeight={600}>Request Date</Typography>
                                <Typography>{new Date(viewingRequest.requestDate).toLocaleDateString()}</Typography>
                            </Box>
                            <Box sx={{ bgcolor: 'grey.100', p: 2, borderRadius: 2 }}>
                                <Typography variant="subtitle1" fontWeight={600}>Quantity Requested</Typography>
                                <Typography>{viewingRequest.quantityRequested}</Typography>
                            </Box>
                            <Box sx={{ bgcolor: 'grey.100', p: 2, borderRadius: 2 }}>
                                <Typography variant="subtitle1" fontWeight={600}>Quantity Dispatched</Typography>
                                <Typography>{viewingRequest.quantityDispatched}</Typography>
                            </Box>
                            <Box sx={{ bgcolor: 'grey.100', p: 2, borderRadius: 2 }}>
                                <Typography variant="subtitle1" fontWeight={600}>Quantity Received</Typography>
                                <Typography>{viewingRequest.quantityReceived}</Typography>
                            </Box>
                            <Box sx={{ bgcolor: 'grey.100', p: 2, borderRadius: 2 }}>
                                <Typography variant="subtitle1" fontWeight={600}>Approved By</Typography>
                                <Typography>{viewingRequest.approvedBy || 'N/A'}</Typography>
                            </Box>
                            <Box sx={{ bgcolor: 'grey.100', p: 2, borderRadius: 2 }}>
                                <Typography variant="subtitle1" fontWeight={600}>Batch Number</Typography>
                                <Typography>{viewingRequest.batchNumber || 'N/A'}</Typography>
                            </Box>
                            <Box sx={{ bgcolor: 'grey.100', p: 2, borderRadius: 2 }}>
                                <Typography variant="subtitle1" fontWeight={600}>Status</Typography>
                                <Typography>{viewingRequest.status || 'Pending'}</Typography>
                            </Box>
                        </Box>
                    )}
                    <Box display="flex" justifyContent="flex-end">
                        <Button 
                            onClick={handleCloseViewModal} 
                            variant="outlined"
                            sx={{ 
                                borderColor: 'grey.400', 
                                color: 'grey.700',
                                '&:hover': { borderColor: 'grey.600', bgcolor: 'grey.100' }
                            }}
                        >
                            Close
                        </Button>
                    </Box>
                </Box>
            </Modal>

            <Dialog
                open={deleteDialogOpen}
                onClose={handleCloseDeleteDialog}
                aria-labelledby="alert-dialog-title"
            >
                <DialogTitle id="alert-dialog-title">
                    Confirm Deletion
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to delete the request for "{productrequestToDelete?.productName}"? This action cannot be undone.
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

export default ProductRequests;