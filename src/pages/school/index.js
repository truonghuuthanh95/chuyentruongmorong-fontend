import React, { Component } from "react";
import {
  Card,
  CardBody,
  CardTitle,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Table,
  Badge,
  Col,
} from "reactstrap";
import { BASE_URL, BASE_URL_MANAGE } from "../../services/baseURL";
import { Formik } from "formik";
import axios from "axios";
import * as moment from "moment";
const token = "VL9QqVEM2EiSzMBRummEQZstcITgilZT";
export default class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      updateField: [],
      classes: [],
      students: [],
      requestedUpdate: [],
      selectUpdateConstrain: ["3", "7", "8", "16", "20"],
      isSelectUpdateNewValue: false,
      newValueSelectArray: [],
      selectedUpdateField: "1",
      provinces: [],
      districts: [],
    };
  }
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
        axios
          .get(
            `https://wapi.hcm.edu.vn/ChuyenTruongMoRong/apiChuyenTruong/GetHocSinh?LopID=${res.data.Result[0].LopID}`,
            { headers: { Token: token } }
          )
          .then((res) => {
            this.setState({ students: res.data.Result });
          });
      });
    axios
      .get(
        `https://wapi.hcm.edu.vn/ChuyenTruongMoRong/apiChuyenTruong/getHocSinhUpDateLog/2019/null`,
        { headers: { Token: token } }
      )
      .then((res) => {
        this.setState({ requestedUpdate: res.data.Result });
      });
  }
  onChangeClasses = (e) => {
    axios
      .get(
        `https://wapi.hcm.edu.vn/ChuyenTruongMoRong/apiChuyenTruong/GetHocSinh?LopID=${e.target.value}`,
        { headers: { Token: token } }
      )
      .then((res) => {
        this.setState({ students: res.data.Result });
      });
  };
  handleChangeUpdateField = (e) => {
    const gender = [
      { ID: 1, Name: "Nữ" },
      { ID: 0, Name: "Nam" },
    ];

    if (this.state.selectUpdateConstrain.includes(e.target.value)) {
      this.setState({ isSelectUpdateNewValue: true });
      if (e.target.value === "3") {
        this.setState({ newValueSelectArray: gender });
      } else if (e.target.value === "7") {
        axios
          .get(`${BASE_URL_MANAGE}/getDanToc`, { headers: { Token: token } })
          .then((res) =>
            this.setState({ newValueSelectArray: res.data.Result })
          );
      } else if (e.target.value === "8") {
        axios
          .get(`${BASE_URL_MANAGE}/getTonGiao`, { headers: { Token: token } })
          .then((res) =>
            this.setState({ newValueSelectArray: res.data.Result })
          );
      } else if (e.target.value === "16" || e.target.value === "20") {
        axios
          .get(`${BASE_URL_MANAGE}/getTinh`, { headers: { Token: token } })
          .then((res) => {
            const provinces = res.data.Result.slice(1);
            this.setState({ provinces });
            axios
              .get(`${BASE_URL_MANAGE}/getHuyen/${res.data.Result[1].ID}`, {
                headers: { Token: token },
              })
              .then((res) => {
                this.setState({ districts: res.data.Result.slice(1) });
              });
            axios
              .get(`${BASE_URL}/getXa/${res.data.Result[1].ID}`)
              .then((res) =>
                this.setState({ newValueSelectArray: res.data.Result })
              );
          });
      }
      this.setState({ selectedUpdateField: e.target.value });
    }
  };
  render() {
    console.log(
      this.state.classes.length > 0 ? this.state.classes[0].LopID : null
    );

    return (
      <div>
        <Col sm={{ size: 6, offset: 3 }}>
          <Card>
            <CardBody>
              <CardTitle>CHỌN HỌC SINH</CardTitle>
              <Formik
                enableReinitialize
                initialValues={{
                  LopID:
                    this.state.classes.length > 0
                      ? this.state.classes[0].LopID
                      : "",
                  HocSinhID:
                    this.state.students.length > 0
                      ? this.state.students[0].HocSinhID
                      : "",
                  updateField:
                    this.state.updateField.length > 0
                      ? this.state.updateField[0].Id
                      : "",
                  newValue: "",
                }}
                //   validationSchema={SignupSchema}
                onSubmit={(values) => {
                  // same shape as initial values
                  const student = this.state.students.filter(
                    (s) => s.HocSinhID === values.HocSinhID
                  );
                  const field = this.state.updateField.filter(
                    (s) => s.Id === values.updateField
                  );
                  let { [field[0].Props]: Props } = student[0];
                  const data = {
                    HocSinhId: values.HocSinhID,
                    UpdatedFiedId: values.updateField,
                    NewValue: values.newValue,
                    OldValue: Props,
                  };

                  axios.post(
                    "https://wapi.hcm.edu.vn/ChuyenTruongMoRong/apiChuyenTruong/PostUpdateHS",
                    data,
                    { headers: { Token: token } }
                  );
                }}
              >
                {({ handleChange, handleSubmit, values }) => (
                  <Form onSubmit={handleSubmit}>
                    <FormGroup>
                      <Label for="LopID">Lớp</Label>
                      <Input
                        type="select"
                        name="LopID"
                        id="LopID"
                        onChange={(e) => {
                          this.onChangeClasses(e);
                          handleChange(e);
                        }}
                        value={values.LopID}
                      >
                        {this.state.classes.map((s) => (
                          <option key={s.LopID} value={s.LopID}>
                            {s.TenLop}
                          </option>
                        ))}
                      </Input>
                    </FormGroup>
                    <FormGroup>
                      <Label for="hocSinhId">Học sinh</Label>
                      <Input
                        type="select"
                        name="HocSinhID"
                        id="HocSinhID"
                        onChange={handleChange}
                        value={values.HocSinhID}
                      >
                        {this.state.students.map((s) => (
                          <option key={s.HocSinhID} value={s.HocSinhID}>
                            {s.HocSinhID} | {s.Ho} {s.Ten} |{" "}
                            {moment(s.NgaySinh).format("DD/MM/YYYY")}
                          </option>
                        ))}
                      </Input>
                    </FormGroup>
                    <FormGroup>
                      <Label for="updateField">Trưởng dữ liệu thay đổi</Label>
                      <Input
                        type="select"
                        name="updateField"
                        id="updateField"
                        value={values.updateField}
                        onChange={(e) => {
                          handleChange(e);
                          this.handleChangeUpdateField(e);
                        }}
                      >
                        {this.state.updateField.map((s) => (
                          <option key={s.Id} value={s.Id}>
                            {s.Name}
                          </option>
                        ))}
                      </Input>
                    </FormGroup>
                    <FormGroup>
                      <Label for="newValue">Giá trị mới</Label>
                      {/* {!this.state.isSelectArray.includes(
                        values.updateField
                      ) ? (
                        <Input
                          type="text"
                          name="newValue"
                          id="newValue"
                          value={values.newValue}
                          onChange={handleChange}
                        />
                      ) : (
                        <Input
                          type="select"
                          name="newValue"
                          id="newValue"
                          value={values.newValue}
                          onChange={handleChange}
                        >
                          <option>aa</option>
                        </Input>
                      )} */}
                    </FormGroup>
                    <p className="text-center">
                      <Button type="submit" color="primary">
                        GỬI YÊU CẦU
                      </Button>
                    </p>
                  </Form>
                )}
              </Formik>
            </CardBody>
          </Card>
        </Col>
        <Card>
          <CardBody>
            <CardTitle>YÊU CẦU ĐÃ GỬI</CardTitle>
            <Table hover>
              <thead>
                <tr>
                  <th>HocSinhID</th>
                  <th>Họ</th>
                  <th>Tên</th>
                  <th>Trường dữ liệu</th>
                  <th>Giá trị cũ</th>
                  <th>Giá trị mới</th>
                  <th>Trang thái</th>
                  <th>Tháo tác</th>
                </tr>
              </thead>
              <tbody>
                {this.state.requestedUpdate.map((s, index) => (
                  <tr key={index}>
                    <td>{s.HocSinhId}</td>
                    <td>{s.Ho}</td>
                    <td>{s.Ten}</td>
                    <td>{s.Name}</td>
                    <td>{s.OldValue}</td>
                    <td>{s.NewValue}</td>
                    <td>
                      {s.ApprovedBy ? (
                        <Badge color="success">Đã duyệt</Badge>
                      ) : (
                        <Badge color="secondary">Chưa duyệt</Badge>
                      )}
                    </td>
                    <td>
                      <Button color="danger">Xóa</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </CardBody>
        </Card>
      </div>
    );
  }
}
