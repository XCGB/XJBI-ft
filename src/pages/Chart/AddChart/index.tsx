import { getGenChartByAiUsingPOST } from '@/services/hjBI/chartController';
import { UploadOutlined } from '@ant-design/icons';
import { useEmotionCss } from '@ant-design/use-emotion-css';
import {
  Button,
  Card,
  Col,
  Divider,
  Form,
  Input,
  message,
  Row,
  Select,
  Space,
  Spin,
  Upload,
} from 'antd';
import TextArea from 'antd/es/input/TextArea';
import ReactECharts from 'echarts-for-react';
import React, { useState } from 'react';

/**
 * 添加图表页面
 * @constructor
 */
const AddChart: React.FC = () => {
  const [chart, setChart] = useState<API.BiResponseVO>();
  const [option, setoption] = useState<any>();
  const [submitting, setSubmitting] = useState<boolean>(false);

  const containerClassName = useEmotionCss(() => {
    return {
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      overflow: 'auto',
      backgroundImage:
        "url('https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/V-_oS6r-i7wAAAAAAAAAAAAAFl94AQBr')",
      backgroundSize: '100% 100%',
    };
  });

  const onFinish = async (values: any) => {
    // 避免重复提交
    if (submitting) {
      return;
    }
    setSubmitting(true);
    setoption(undefined);
    setChart(undefined);
    const params = {
      ...values,
      file: undefined,
    };
    try {
      const res = await getGenChartByAiUsingPOST(params, {}, values.file.file.originFileObj);
      if (!res?.data) {
        message.error('分析失败');
      } else {
        message.success('分析成功');
        const chartOption = JSON.parse(res.data.genChart ?? '');
        console.log(chartOption);
        if (!chartOption) {
          throw new Error('图表代码解析错误');
        } else {
          setChart(res.data);
          setoption(chartOption);
        }
      }
    } catch (e: any) {
      message.error('分析失败' + e.message);
    }
    setSubmitting(false);
  };

  return (
    <div className={containerClassName}>
      <Row gutter={24}>
        <Col span={12}>
          <Card title="智能分析">
            <Form
              name="add-chart"
              // labelAlign= "left"
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 17 }}
              onFinish={onFinish}
              initialValues={{}}
            >
              <Form.Item name="name" label="图表名称">
                <Input placeholder="请输入你的图表名称" />
              </Form.Item>

              <Form.Item
                name="goal"
                label="分析需求"
                rules={[{ required: true, message: '请输入你的分析目标！' }]}
              >
                <TextArea placeholder="请输入你的分析目标，比如：请分析网站用户增长情况。" />
              </Form.Item>

              <Form.Item name="chartType" label="图表类型">
                <Select
                  placeholder="请选择图表类型"
                  options={[
                    { value: '折线图', label: '折线图' },
                    { value: '柱状图', label: '柱状图' },
                    { value: '堆叠图', label: '堆叠图' },
                    { value: '雷达图', label: '雷达图' },
                    { value: '饼图', label: '饼图' },
                    { value: '散点图', label: '散点图' },
                  ]}
                />
              </Form.Item>

              <Form.Item name="file" label="原始数据">
                <Upload name="file" action="/upload.do">
                  <Button icon={<UploadOutlined />}>上传 Excel 文件</Button>
                </Upload>
              </Form.Item>

              {/*        <Form.Item label="文件上传">
          <Form.Item name="file" valuePropName="fileList" getValueFromEvent={normFile} noStyle>
            <Upload.Dragger name="file" action="/upload.do">
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">单击或拖动文件到此区域进行上传</p>
              <p className="ant-upload-hint">支持单个或批量上传</p>
            </Upload.Dragger>
          </Form.Item>
        </Form.Item>*/}

              <Form.Item wrapperCol={{ span: 16, offset: 4 }}>
                <Space>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={submitting}
                    disabled={submitting}
                  >
                    提交
                  </Button>
                  <Button htmlType="reset">重置</Button>
                </Space>
              </Form.Item>
            </Form>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="分析结论">
            {chart?.genResult ?? <div>请先在左侧进行提交</div>}
            <Spin spinning={submitting} />
          </Card>
          <Divider />
          <Card title="可视化图表">
            {option ? <ReactECharts option={option} /> : <div>请先在左侧进行提交</div>}
            <Spin spinning={submitting} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};
export default AddChart;
