import { Drawer, Spin } from 'antd';
import { isEmpty } from 'lodash';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../../redux/store';
import ContractAddendum from './ContractAddendum';

const initialState = {
  userName: '',
  fullName: '',
  password: '',
  confirmPassword: '',
  email: '',
  phoneNumber: '',
  role: '',
  company: '',
  position: '',
};

export default function ContractAddendumDrawer(props) {
  const navigate = useNavigate();
  const { onClose, open } = props;

  const [initialValues, setInitialValues] = useState(initialState);

  const loading = useSelector((state) => state.contract.loading);

  const selectedContract = useSelector((state) => state.contract.editingContract);
  console.log('editingContract2:', selectedContract);
  const dispatch = useAppDispatch();

  useEffect(() => {
    setInitialValues(selectedContract || initialState);
  }, [selectedContract]);

  return (
    <Drawer
      width={'85%'}
      title={`Danh sách phụ lục của hợp đồng ${initialValues && initialValues?.name}`}
      placement="right"
      onClose={onClose}
      open={open}
    >
      {!isEmpty(selectedContract) && isEmpty(initialValues) ? (
        <Spin />
      ) : (
        <ContractAddendum selectedContract={selectedContract} />
      )}
    </Drawer>
  );
}
