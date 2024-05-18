import React, { useState, useEffect } from 'react'
import { WrapperHeader, WrapperUploadFile } from './style'
import { Button, Modal, Form, } from "antd";
import TableComponent from '../TableComponent/TableComponent';
import InputComponent from '../InputComponent/InputComponent';
import { getBase64 } from '../../utils'
import * as ProductService from "../../services/ProductService";
import { useMutationHooks } from '../../hooks/useMutationHook';
import { useQuery } from '@tanstack/react-query'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { useSelector } from 'react-redux'
import * as message from '../../components/Message/Message'
import ModalComponent from '../ModalComponent/ModalComponent'

const AdminProduct = () => {
  const [rowSelected, setRowSelected] = useState('')
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isOpenModalUpdate, setIsOpenModalUpdate] = useState(false)
  const user = useSelector((state) => state?.user)
  const inittial = () => ({
    name: '',
    type: '',
    price: '',
    description: '',
    image: '',
    countInStock: '',
  })
  const [stateProduct, setStateProduct] = useState(inittial())
  const [stateProductDetails, setStateProductDetails] = useState(inittial())

  const [form] = Form.useForm();

  const mutation = useMutationHooks(
    (data) => {
      const { name,
        price,
        description,
        image,
        countInStock,
        type } = data
      const res = ProductService.createProduct({
        name,
        price,
        description,
        image,
        type,
        countInStock,
      })
      console.log(res)
      return res
    }
  )

  const mutationUpdate = useMutationHooks(
    (data) => {
      const { id,
        token,
        ...rests } = data
      const res = ProductService.updateProduct(
        id,
        token,
        { ...rests })
      return res
    },
  )

  const mutationDeleted = useMutationHooks(
    (data) => {
      const { id,
        token,
      } = data
      const res = ProductService.deleteProduct(
        id,
        token)
      return res
    },
  )

  const getAllProducts = async () => {
    const res = await ProductService.getAllProduct()
    return res
  }

  const fetchGetDetailsProduct = async (rowSelected) => {
    const res = await ProductService.getDetailsProduct(rowSelected)
    if (res?.data) {
      setStateProductDetails({
        name: res?.data?.name,
        price: res?.data?.price,
        description: res?.data?.description,
        image: res?.data?.image,
        type: res?.data?.type,
        countInStock: res?.data?.countInStock,
      })
    }
  }

  const { data, isSuccess, isError } = mutation
  const { data: dataUpdated, isSuccess: isSuccessUpdated, isError: isErrorUpdated } = mutationUpdate
  const { data: dataDeleted, isSuccess: isSuccessDelected, isError: isErrorDeleted } = mutationDeleted

  const queryProduct = useQuery({ queryKey: ['products'], queryFn: getAllProducts })
  const { data: products } = queryProduct
  const renderAction = () => {
    return (
      <div>
        <EditOutlined style={{ color: 'red', fontSize: '30px', cursor: 'pointer' }} onClick={handleDetailsProduct} />
        <DeleteOutlined style={{ color: 'orange', fontSize: '30px', cursor: 'pointer' }} onClick={() => setIsModalOpenDelete(true)} />
      </div>
    )
  }

  const columns = [
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      sorter: (a, b) => a.name.length - b.name.length,
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: 'Loại sản phẩm',
      dataIndex: 'type',
    },
    {
      title: 'Mô tả sản phẩm',
      dataIndex: 'description',
    },
    {
      title: 'Hình ảnh',
      dataIndex: 'image',
      render: (image) => (
        <img src={image} style={{
          height: '150px',
          width: '150px',

          objectFit: 'cover',
          marginLeft: '10px'
        }}
          alt="avatar"
        />
      )
    },
    {
      title: 'Action',
      dataIndex: 'action',
      render: renderAction
    },
  ];
  const dataTable = products?.data?.length && products?.data?.map((product) => {
    return { ...product, key: product._id }
  })

  useEffect(() => {
    if (isSuccess && data?.status === 'OK') {
      message.success()
      handleCancel()
    } else if (isError) {
      message.error()
    }
  }, [isSuccess])

  useEffect(() => {
    if (!isModalOpen) {
      form.setFieldsValue(stateProductDetails)
    } else {
      form.setFieldsValue(inittial())
    }
  }, [form, stateProductDetails, isModalOpen])

  useEffect(() => {
    if (rowSelected && isModalOpenDelete) {
      fetchGetDetailsProduct(rowSelected)
    }
  }, [rowSelected, isModalOpenDelete])

  useEffect(() => {
    if (isSuccessUpdated && dataUpdated?.status === 'OK') {
      message.success()
      handleCloseModalUpdate()
    } else if (isErrorUpdated) {
      message.error()
    }
  }, [isSuccessUpdated])

  useEffect(() => {
    if (isSuccessDelected && dataDeleted?.status === 'OK') {
      message.success()
      handleCancelDelete()
    } else if (isErrorDeleted) {
      message.error()
    }
  }, [isSuccessDelected])

  const handleDetailsProduct = () => {
    setIsOpenModalUpdate(true)
  }

  const handleCloseModalUpdate = () => {
    setIsOpenModalUpdate(false);
    setStateProductDetails({
      name: '',
      price: '',
      description: '',
      rating: '',
      image: '',
      type: '',
      countInStock: ''
    })
    form.resetFields()
  };

  const handleCancelDelete = () => {
    setIsModalOpenDelete(false)
  }

  const handleDeleteProduct = () => {
    mutationDeleted.mutate({ id: rowSelected, token: user?.access_token }, {
      onSettled: () => {
        queryProduct.refetch()
      }
    })
  }

  const handleCancel = () => {
    setIsModalOpen(false);
    setStateProduct({
      name: '',
      price: '',
      description: '',
      image: '',
      type: '',
      countInStock: '',
    })
    form.resetFields()
  };

  const onFinish = () => {
    const params = {
      name: stateProduct.name,
      price: stateProduct.price,
      description: stateProduct.description,
      image: stateProduct.image,
      countInStock: stateProduct.countInStock,
      type: stateProduct.type === 'add_type' ? stateProduct.newType : stateProduct.type,
    }
    mutation.mutate(params, {
      onSettled: () => {
        queryProduct.refetch()
      }
    })
  }

  const handleOnchange = (e) => {
    setStateProduct({
      ...stateProduct,
      [e.target.name]: e.target.value
    })
  }

  const handleOnchangeDetails = (e) => {
    setStateProductDetails({
      ...stateProductDetails,
      [e.target.name]: e.target.value
    })
  }

  const handleOnchangeImage = async ({ fileList }) => {
    const file = fileList[0]
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setStateProduct({
      ...stateProduct,
      image: file.preview
    })
  }

  const handleOnchangeImageDetails = async ({ fileList }) => {
    const file = fileList[0]
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setStateProductDetails({
      ...stateProductDetails,
      image: file.preview
    })
  }

  const onUpdateProduct = () => {
    mutationUpdate.mutate({ id: rowSelected, token: user?.access_token, ...stateProductDetails }, {
      onSettled: () => {
        queryProduct.refetch()
      }
    })
  }

  return (
    <div>
      <WrapperHeader>Quản lý sản phẩm</WrapperHeader>
      <div style={{ marginTop: '10px' }}>
        <Button style={{ borderRadius: '6px', borderStyle: 'dashed' }} onClick={() => setIsModalOpen(true)}>Add</Button>
      </div>
      <div style={{ marginTop: '20px' }}>
        <TableComponent columns={columns} data={dataTable} onRow={(record, rowIndex) => {
          // handleDelteMany = { handleDelteManyProducts }
          return {
            onClick: event => {
              setRowSelected(record._id)
            }
          };
        }} />
      </div>
      <Modal title="Thêm sản phẩm" open={isModalOpen} onCancel={handleCancel} footer={null}>
        <Form
          name="basic"
          onFinish={onFinish}
          autoComplete="on"
          form={form}
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 14 }}
          layout="horizontal"
          style={{ maxWidth: 600 }}
        >
          <Form.Item
            label="Tên"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm" }]}>
            <InputComponent value={stateProduct.name} onChange={handleOnchange} name="name" />
          </Form.Item>
          <Form.Item
            label="Loại"
            name="type"
            rules={[{ required: true, message: "Vui lòng nhập loại sản phẩm" }]}>
            <InputComponent value={stateProduct.type} onChange={handleOnchange} name="type" />
          </Form.Item>
          <Form.Item
            label="Số lượng trong kho"
            name="countInStock"
            rules={[{ required: true, message: 'Vui lòng nhập số lượng trong kho' }]}>
            <InputComponent value={stateProduct.countInStock} onChange={handleOnchange} name="countInStock" />
          </Form.Item>
          <Form.Item
            label="Giá"
            name="price"
            rules={[{ required: true, message: "Vui lòng nhập giá sản phẩm" }]}>
            <InputComponent value={stateProduct.price} onChange={handleOnchange} name="price" />
          </Form.Item>
          <Form.Item
            label="Mô tả"
            name="description"
            rules={[{ required: true, message: "Vui lòng nhập mô tả sản phẩm" }]}>
            <InputComponent value={stateProduct.description} onChange={handleOnchange} name="description" />
          </Form.Item>
          <Form.Item
            label="Hình ảnh"
            name="image"
            rules={[{ required: true, message: "Vui lòng chọn hình ảnh" }]}>
            <WrapperUploadFile fileList={stateProduct.image ? [{ uid: '-1', name: 'image', status: 'done', url: stateProduct.image }] : []} onChange={handleOnchangeImage} maxCount={1}>
              <Button >Select File</Button>
              {stateProduct?.image && (
                <img src={stateProduct?.image} style={{
                  height: '60px',
                  width: '60px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  marginLeft: '10px'
                }} alt="avatar" />
              )}
            </WrapperUploadFile>
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 20, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal title="Sửa thông tin sản phẩm" open={isOpenModalUpdate} onCancel={handleCloseModalUpdate} footer={null}>
        <Form
          name="basic"
          onFinish={onUpdateProduct}
          autoComplete="on"
          form={form}
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 14 }}
          layout="horizontal"
          style={{ maxWidth: 600 }}
        >
          <Form.Item
            label="Tên"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm" }]}>
            <InputComponent value={stateProductDetails['name']} onChange={handleOnchangeDetails} name="name" />
          </Form.Item>
          <Form.Item
            label="Loại"
            name="type"
            rules={[{ required: true, message: "Vui lòng nhập loại sản phẩm" }]}>
            <InputComponent value={stateProductDetails['type']} onChange={handleOnchangeDetails} name="type" />
          </Form.Item>
          <Form.Item
            label="Số lượng trong kho"
            name="countInStock"
            rules={[{ required: true, message: 'Vui lòng nhập số lượng trong kho' }]}>
            <InputComponent value={stateProductDetails['countInStock']} onChange={handleOnchangeDetails} name="countInStock" />
          </Form.Item>
          <Form.Item
            label="Giá"
            name="price"
            rules={[{ required: true, message: "Vui lòng nhập giá sản phẩm" }]}>
            <InputComponent value={stateProductDetails['price']} onChange={handleOnchangeDetails} name="price" />
          </Form.Item>
          <Form.Item
            label="Mô tả"
            name="description"
            rules={[{ required: true, message: "Vui lòng nhập mô tả sản phẩm" }]}>
            <InputComponent value={stateProductDetails['description']} onChange={handleOnchangeDetails} name="description" />
          </Form.Item>
          <Form.Item
            label="Hình ảnh"
            name="image"
            rules={[{ required: true, message: "Vui lòng chọn hình ảnh" }]}>
            <WrapperUploadFile fileList={stateProductDetails.image ? [{ uid: '-1', name: 'image', status: 'done', url: stateProduct.image }] : []} onChange={handleOnchangeImageDetails} maxCount={1}>
              <Button >Select File</Button>
              {stateProductDetails?.image && (
                <img src={stateProductDetails?.image} style={{
                  height: '60px',
                  width: '60px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  marginLeft: '10px'
                }} alt="avatar" />
              )}
            </WrapperUploadFile>
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 20, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Apply
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <ModalComponent title="Xóa sản phẩm" open={isModalOpenDelete} onCancel={handleCancelDelete} onOk={handleDeleteProduct}>
        <div>Bạn có chắc xóa sản phẩm này không?</div>
      </ModalComponent>
    </div>
  )
}

export default AdminProduct