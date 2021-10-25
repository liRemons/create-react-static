import { Button, Form, Card } from 'antd';
import FormItem from '@components/Form';
import store from './model/store'
import { observer } from 'mobx-react'

@observer
export default class App extends React.Component {
  render() {
    const { total } = store;
    return <Card>
      <Form
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
      >
        <FormItem label='数字输入' component='inputNumber' value={total}></FormItem>
        <FormItem label='输入' component='input'></FormItem>
        <FormItem label='选择器' component='select'></FormItem>
        <FormItem label='多选' component='checkbox'></FormItem>
        <Form.Item>
          <Button onClick={()=>store.changePrice()}> + </Button>
        </Form.Item>
      </Form>
    </Card>
  }
}
