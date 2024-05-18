import React from 'react'
import { WrapperHeader, WrapperUploadFile } from './style'
import TableComponent from '../TableComponent/TableComponent'
import { convertPrice, getBase64 } from '../../utils'
import * as OrderService from '../../services/OrderService'
import { useQuery } from '@tanstack/react-query'
import { useSelector } from 'react-redux'

const OrderAdmin = () => {
  const user = useSelector((state) => state?.user)

  const getAllOrder = async () => {
    const res = await OrderService.getAllOrder(user?.access_token)
    return res
  }

  const queryOrder = useQuery({ queryKey: ['orders'], queryFn: getAllOrder })
  const { data: orders } = queryOrder

  const columns = [
    {
      title: 'Tên khách hàng',
      dataIndex: 'userName',
      sorter: (a, b) => a.userName.length - b.userName.length,
    },
    {
      title: 'Điện thoại',
      dataIndex: 'phone',
      sorter: (a, b) => a.phone.length - b.phone.length,
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
      sorter: (a, b) => a.address.length - b.address.length,
    },
    {
      title: 'Phương thức thanh toán',
      dataIndex: 'paymentMethod',
      sorter: (a, b) => a.paymentMethod.length - b.paymentMethod.length,
    },
    {
      title: 'Số lượng',
      dataIndex: 'orderItems',
      render: orderItems => (
        <>
          {orderItems.map(item => (
            <div key={item._id}>
              {item.amount}
            </div>
          ))}
        </>
      ),
    },
    {
      title: 'Tên giày',
      dataIndex: 'orderItems',
      render: orderItems => (
        <>
          {orderItems.map(item => (
            <div key={item._id}>
              {item.name}
            </div>
          ))}
        </>
      ),
    },
    {
      title: 'Hình ảnh minh họa',
      dataIndex: 'orderItems',
      render: orderItems => (
        <>
          {orderItems.map(item => (
            <div key={item._id}>
              <img src={item.image} alt={item.name} style={{ width: '100px', height: '100px', alignItems: "center" }} />
            </div>
          ))}
        </>
      ),
    },
    {
      title: 'Giá sản phẩm',
      dataIndex: 'totalPrice',
      sorter: (a, b) => a.totalPrice.length - b.totalPrice.length,
    },
  ];

  const dataTable = orders?.data?.length && orders?.data?.map((order) => {
    return { ...order, key: order._id, userName: order?.shippingAddress?.fullName, phone: order?.shippingAddress?.phone, address: order?.shippingAddress?.address, paymentMethod: [order?.paymentMethod], isPaid: order?.isPaid ? 'TRUE' : 'FALSE', isDelivered: order?.isDelivered ? 'TRUE' : 'FALSE', totalPrice: convertPrice(order?.totalPrice), orderItems: order?.orderItems }
  })

  return (
    <div>
      <WrapperHeader>Quản lý đơn hàng</WrapperHeader>
      <div style={{ marginTop: '20px' }}>
        <TableComponent columns={columns} data={dataTable} />
      </div>
    </div>
  )
}

export default OrderAdmin