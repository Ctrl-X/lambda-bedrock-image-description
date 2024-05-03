import logo from "./logo.svg"
import "./App.css"
import ImageDescription from "./component/ImageDescription"
import type { MenuProps } from "antd"
import { Layout, Menu, Space, theme } from "antd"
import {
    GithubOutlined
} from "@ant-design/icons"

const { Header, Content, Footer, Sider } = Layout

function App() {
    return (
        <Layout className="App">
            <Header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <a
                    className="App-link"
                    href="https://github.com/Ctrl-X/lambda-bedrock-image-description/tree/withAmplify"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GitHub Repository"
                ><Space>
                    View on
                    <GithubOutlined style={{ fontSize: 30 }} />
                </Space>
                </a>
            </Header>

            <Content className="App-Content">
                <div className="image-uploader">
                    <ImageDescription />

                </div>

            </Content>

            <Footer></Footer>
        </Layout>

    )

}

export default App
