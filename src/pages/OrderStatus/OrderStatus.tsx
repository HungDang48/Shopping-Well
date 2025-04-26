import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './OrderStatus.css'; // Import CSS

interface Product {
  productId: number;
  name: string;
  quantity: number;
  price: number;
  size: string;
  color: string;
}

interface ShippingInfo {
  GuestName: string;
  GuestNumber: string;
  Address: string;
}

interface OrderData {
  OrderID: number;
  orderStatus: string;
  orderDate: string;
  paymentStatus: string;
  paymentMethod: string;
  products: Product[] | undefined;
  shippingInfors: ShippingInfo | undefined;
  shippingFee: number | undefined;
  courier: string;
  totalAmount: number | undefined;
  discount: number | undefined;
}

const OrderStatus: React.FC = () => {
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axios.get('https://shopping-well-back-end-production.up.railway.app/Orders');
        console.log(response.data); // Xem dữ liệu trả về từ API
        setOrderData(response.data);
      } catch (err) {
        setError('Failed to fetch order data');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!orderData) return <div>No order data available</div>;

  // Kiểm tra dữ liệu shippingInfors
  const guestName = orderData?.shippingInfors?.GuestName || 'N/A';
  const guestNumber = orderData?.shippingInfors?.GuestNumber || 'N/A';
  const address = orderData?.shippingInfors?.Address || 'N/A';

  // Kiểm tra giá trị của shippingFee, totalAmount, discount
  const shippingFee = orderData?.shippingFee ? orderData?.shippingFee.toLocaleString('vi-VN') : 'N/A';
  const totalAmount = orderData?.totalAmount ? orderData?.totalAmount.toLocaleString('vi-VN') : 'N/A';
  const discount = orderData?.discount ? orderData?.discount.toLocaleString('vi-VN') : 'N/A';

  return (
    <div className="order-details">
      <h1>Thông Tin Đơn Hàng</h1>
      <div className="order-info">
        <p><strong>Mã Đơn Hàng:</strong> {orderData.OrderID}</p>
        <p><strong>Trạng Thái Đơn Hàng:</strong> {orderData.orderStatus}</p>
        <p><strong>Ngày Đặt:</strong> {new Date(orderData.orderDate).toLocaleDateString()}</p>
        <p><strong>Phương Thức Thanh Toán:</strong> {orderData.paymentMethod}</p>
        <p><strong>Trạng Thái Thanh Toán:</strong> {orderData.paymentStatus}</p>

        <h2>Sản Phẩm:</h2>
        {orderData.products && orderData.products.length > 0 ? (
          orderData.products.map((product, index) => (
            <div key={index} className="product">
              <p><strong>Tên:</strong> {product.name}</p>
              <p><strong>Số Lượng:</strong> {product.quantity}</p>
              <p><strong>Giá:</strong> {product.price.toLocaleString('vi-VN')} VND</p>
              <p><strong>Size:</strong> {product.size}</p>
              <p><strong>Màu:</strong> {product.color}</p>
            </div>
          ))
        ) : (
          <p>Không có sản phẩm nào trong đơn hàng.</p>
        )}

        <h2>Thông Tin Vận Chuyển:</h2>
        <p><strong>Tên Người Nhận:</strong> {guestName}</p>
        <p><strong>Số Điện Thoại:</strong> {guestNumber}</p>
        <p><strong>Địa Chỉ:</strong> {address}</p>
        <p><strong>Phí Vận Chuyển:</strong> {shippingFee}</p>
        <p><strong>Dịch Vụ Giao Hàng:</strong> {orderData.courier}</p>

        <h2>Tổng Kết Đơn Hàng:</h2>
        <p><strong>Tổng Số Tiền:</strong> {totalAmount}</p>
        <p><strong>Giảm Giá:</strong> {discount}</p>
      </div>
    </div>
  );
};

export default OrderStatus;
