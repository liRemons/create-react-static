import { Button, Form, Card } from 'antd';
import FormItem from '@components/Form';
import { inject } from '@royjs/core';
import store from './model/store'
@inject(store)
export default class App extends React.Component {
  render() {
    const { count } = this.props.state;
    return <Card>
      <Form
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
      >
        <FormItem label='数字输入' component='inputNumber' value={count}></FormItem>
        <FormItem label='输入' component='input'></FormItem>
        <FormItem label='选择器' component='select'></FormItem>
        <FormItem label='多选' component='checkbox'></FormItem>
        <Form.Item>
          <Button onClick={() => this.props.dispatch('add')}> + </Button>
        </Form.Item>
      </Form>
    </Card>
  }
}
