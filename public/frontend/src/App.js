import logo from "./logo.svg"
import "./App.css"
import ImageDescription from "./component/ImageDescription"
import type { MenuProps } from "antd"
import { Alert, Layout, Menu, Space, theme } from "antd"
import {
    GithubOutlined
} from "@ant-design/icons"

const { Header, Content, Footer, Sider } = Layout

function App() {
    return (
        <Layout className="App">
            <Header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />

                <h1>
                    Generate Product Description
                    <br />
                    <small>using Claude 3 Sonnet on Bedrock</small>

                </h1>

                <a
                    className="App-link"
                    href="https://github.com/Ctrl-X/lambda-bedrock-image-description/tree/withAmplify"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GitHub Repository"
                ><Space>
                    <span>View on</span>
                    <GithubOutlined style={{ fontSize: 30 }} />
                </Space>
                </a>
            </Header>

            <Alert message="This project is a demonstration / proof-of-concept and is not intended for use in production environments. It is provided as-is, without warranty or guarantee of any kind. The code and any accompanying materials are for educational, testing, or evaluation purposes only." type="warning" />

            <Content className="App-Content">
                <div className="image-uploader">
                    <ImageDescription
                        apigateway="https://w3mckw4goc.execute-api.us-west-2.amazonaws.com/beta/" />

                </div>

            </Content>

            <Footer></Footer>
        </Layout>

    )

}

export default App
