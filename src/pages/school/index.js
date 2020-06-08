import React, { Component } from "react";
import {
  Card,
  Form,
  Input,
  Button,
  Radio,
  Select,
  Row,
  Col,
  Table,
  Tag,
  Space,
  InputNumber
} from "antd";
import axios from "axios";
import * as moment from "moment";
const { Option } = Select;

const token = "q86SjmYL2Eibz8ipbimOQKcam6QJtP99";
const validateMessages = {
    required: '${label} is required!',
    types: {
      email: '${label} is not validate email!',
      number: '${label} is not a validate number!',
    },
    number: {
      range: '${label} must be between ${min} and ${max}',
    },
  };
export default class Index extends Component {
  state = {
    updateField: [],
    classes: [],
    students: [],
    columns: [
      {
        title: "HOCSINHID",
        dataIndex: "hocSinhId",
        key: "hocSinhId",
        render: (text) => <a>{text}</a>,
      },
      {
        title: "HỌ",
        dataIndex: "ho",
        key: "ho",
      },
      {
        title: "TÊN",
        dataIndex: "ten",
        key: "ten",
      },
      {
        title: "TRẠNG THÁI",
        key: "tags",
        dataIndex: "tags",
        render: (tags) => (
          <>
            {tags.map((tag) => {
              let color = tag.length > 5 ? "geekblue" : "green";
              if (tag === "loser") {
                color = "volcano";
              }
              return (
                <Tag color={color} key={tag}>
                  {tag.toUpperCase()}
                </Tag>
              );
            })}
          </>
        ),
      },
      {
        title: "THAO TÁC",
        key: "action",
        render: (text, record) => (
          // <Space size="middle">
          //   <a>Invite {record.name}</a>
          //   <a>Delete</a>
          // </Space>
          <div></div>
        ),
      },
    ],

    data: [
      {
        key: "1",
        name: "John Brown",
        age: 32,
        address: "New York No. 1 Lake Park",
        tags: ["nice", "developer"],
      },
      {
        key: "2",
        name: "Jim Green",
        age: 42,
        address: "London No. 1 Lake Park",
        tags: ["loser"],
      },
      {
        key: "3",
        name: "Joe Black",
        age: 32,
        address: "Sidney No. 1 Lake Park",
        tags: ["cool", "teacher"],
      },
    ],
  };
  componentDidMount() {
    axios
      .get(
        "https://wapi.hcm.edu.vn/ChuyenTruongMoRong/apiChuyenTruong/GetUpdateField",
        { headers: { Token: token } }
      )
      .then((res) => {
        this.setState({ updateField: res.data.Result });
      });
    axios
      .get(
        "https://wapi.hcm.edu.vn/ChuyenTruongMoRong/apiChuyenTruong/GetLop",
        { headers: { Token: token } }
      )
      .then((res) => {
        this.setState({ classes: res.data.Result });
      });
  }
  onChangeClasses = (value) => {
    axios
      .get(
        `https://wapi.hcm.edu.vn/ChuyenTruongMoRong/apiChuyenTruong/GetHocSinh?LopID=${value}`,
        { headers: { Token: token } }
      )
      .then((res) => {
        this.setState({ students: res.data.Result });
      });
      axios.get(`https://wapi.hcm.edu.vn/ChuyenTruongMoRong/apiChuyenTruong/getHocSinhUpDateLog/2019/null`,{ headers: { Token: token } } )
  };
  submitForm = (value) => {
      value.preventDefault();
    console.log(value);
    
  }
  render() {
    console.log(this.state.updateField);
    return (
      <div>
        <Row>
          <Col span={12} offset={6}>
            <Card title="CHỌN HOC SINH">
              <Form onSubmit={this.submitForm} name="nest-messages">
                <Form.Item label="Tên lớp" name={['user', 'lopId']}>
                  <Select onChange={this.onChangeClasses}>
                    {this.state.classes.map((s) => (
                      <Option key={s.LopID} value={s.LopID}>
                        {s.TenLop}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item label="Học sinh" name={['user', 'hocSinhId']}>
                  <Select>
                    {this.state.students.map((s) => (
                      <Option key={s.HocSinhID} value={s.HocSinhID}>
                        {s.HocSinhID} |{" "}
                        <b>
                          {s.Ho} {s.Ten}{" "}
                        </b>
                        | {moment(s.NgaySinh).format("DD/MM/YYYY")}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item label="Trường dữ liệu điêu chỉnh" name={['user', 'updateField']}>
                  <Select>
                    {this.state.updateField.map((s) => (
                      <Option key={s.Id} value={s.Id}>
                        {s.Name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item label="Giá trị mới" name={['user', 'NewValue']}>
                  <Input />
                </Form.Item>
                <Form.Item>
                  <Button htmlType="submit" type="primary">Lưu</Button>
                </Form.Item>     
                </Form>     
            </Card>
          </Col>
        </Row>
        <Card
          title="YÊU CẦU ĐÃ GỬI"
          // style={{ width: 300 }}
        >
          <Table columns={this.state.columns} dataSource={this.state.data} />
        </Card>
      </div>
    );
  }
}
