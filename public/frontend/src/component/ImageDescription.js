import React, { useState } from "react"
import { InboxOutlined } from "@ant-design/icons"
import type { UploadProps } from "antd"
import { Badge, Descriptions, Image, Layout, message, Popover, Space, Upload } from "antd"
import type { DescriptionsProps } from "antd"

const { Dragger } = Upload


const ImageDescription: React.FC = ({ apigateway }) => {
    const [previewImage, setPreviewImage] = useState("")
    const [productInfo, setProductInfo] = useState({})
    const [processingStatus, setProcessingStatus] = useState("default")

    const exampleList = [
        "./2.jpg",
        "./5.jpg",
        "./8.jpg",
        "./10.jpg",
        "./18.jpg",
    ]
    const items: DescriptionsProps["items"] = [
        {
            key: "1",
            label: "Product",
            children: productInfo.product_name
        },
        {
            key: "2",
            label: "Brand",
            children: productInfo.product_brand
        },
        {
            key: "4",
            label: "Format",
            children: productInfo.format_size
        },
        {
            key: "5",
            label: "Category",
            children: productInfo.category,
            span: 2
        }, {
            key: "3",
            label: "Description",
            children: productInfo.description
        },
        {
            key: "6",
            label: "Status",
            children: <Badge status={processingStatus} text={processingStatus} />,
            span: 3
        }
    ]


    const props: UploadProps = {
        name: "productImage",
        multiple: true,
        action: apigateway,
        onChange(info, fileList, event) {
            const { response, status } = info.file
            if (status !== "uploading") {
                setProcessingStatus("processing")
                setPreviewImage(null)
                setProductInfo({})
                console.log(info.file, info.fileList)
            }
            if (status === "done") {
                message.success(`${info.file.name} file uploaded successfully.`)
                if (response && response.fileName) {
                    setPreviewImage(response.fileName)
                    setProductInfo(response.productInfo)
                    setProcessingStatus("success")
                }
            } else if (status === "error") {
                message.error(`${info.file.name} file upload failed.`)
                setProcessingStatus("error")
                setProductInfo({ description: JSON.stringify(response) })
            }
        },
        onDrop(e) {
            console.log("Dropped files", e.dataTransfer.files)
        }
    }

    const handleExamplePicture = async (event, picturePath) => {
        if (event) {
            event.preventDefault()
            event.stopPropagation()
        }
        await fetch(picturePath)
            .then(response => response.blob())
            .then(blob => {
                const file = new File([blob], "photo.jpg", { type: "image/jpg" })
                const formData = new FormData()
                formData.append("productImage", file)
                setProcessingStatus("processing")
                return fetch(apigateway, {
                    method: "POST",
                    body: formData
                })
            })
            .then(response => {
                if (response.ok) {
                    response.json().then(data => {
                        setPreviewImage(data.fileName)
                        setProductInfo(data.productInfo)
                        setProcessingStatus("success")
                    })
                } else {
                    setProcessingStatus("error")
                    console.error("Error uploading file:", response.status)
                }

            }).catch(error => {
                setProcessingStatus("error")
                setProductInfo({ description: error.toString() })
                console.error("Error uploading file:", error)
            })
    }

    return <>
        <Dragger {...props}>
            <p className="ant-upload-drag-icon">
                <InboxOutlined />
            </p>
            <p className="ant-upload-text">Click or drag a product picture that contain some text</p>
            <p className="ant-upload-hint">
                Support for a single or bulk upload. Strictly prohibited from uploading company data or other
                banned files.
            </p>
        </Dragger>

        <div style={{ margin: 30 }}>
            <Space>
                Product Pictures example :
                {exampleList.map((image,index) =>
                    <Popover content={<img src={image} height={300}/>} title={"Product " + index}>
                        <a href={image} target="_blank"
                           onClick={(e) => handleExamplePicture(e,  image )}> Product {index}</a>
                    </Popover>)}
            </Space>
        </div>
        {processingStatus === "processing" &&
            <Badge status={processingStatus} text={processingStatus} />
        }

        {processingStatus === "success" && (
            <Layout style={{ flexDirection: "row",flexWrap:"wrap" }}>
                <Image
                    style={{ paddingRight: "12px" }}
                    width={500}
                    src={previewImage}
                />
                <Descriptions column={1}
                              title="Product Info"
                              bordered items={items} />
            </Layout>
        )}
    </>
}

export default ImageDescription