import React, { useState } from "react"
import { InboxOutlined } from "@ant-design/icons"
import type { UploadProps } from "antd"
import { Badge, Descriptions, Image, Layout, message, Space, Upload } from "antd"
import type { DescriptionsProps } from "antd"

const { Dragger } = Upload


const ImageDescription: React.FC = () => {
    const [previewImage, setPreviewImage] = useState("")
    const [productInfo, setProductInfo] = useState({})
    const [processingStatus, setProcessingStatus] = useState("processing")

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
        },{
            key: "3",
            label: "Description",
            children: productInfo.description
        },
        {
            key: "6",
            label: "Status",
            children: <Badge status={processingStatus} text="Proceed" />,
            span: 3
        }
    ]


    const props: UploadProps = {
        name: "productImage",
        multiple: true,
        action: "https://w3mckw4goc.execute-api.us-west-2.amazonaws.com/beta/",
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

    return <>
        <Dragger {...props}>
            <p className="ant-upload-drag-icon">
                <InboxOutlined />
            </p>
            <p className="ant-upload-text">Click or drag file to this area to upload</p>
            <p className="ant-upload-hint">
                Support for a single or bulk upload. Strictly prohibited from uploading company data or other
                banned files.
            </p>
        </Dragger>
        <div>

            {processingStatus !== "processing" && (
                <Layout style={{flexDirection:"row"}}>
                    <Image
                        style={{paddingRight:"12px"}}
                        width={500}
                        src={previewImage}
                    />
                    <Descriptions column={1} title="Product Info" bordered items={items} />
                </Layout>
            )}
        </div>
    </>
}

export default ImageDescription