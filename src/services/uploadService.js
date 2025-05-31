import http from '@/utils/http';
import { notification } from 'antd';

/**
 * Hàm upload chung cho tất cả loại file (ảnh, tài liệu, hợp đồng, phụ lục)
 * Sử dụng multipart/form-data để upload raw file binary
 * @param {Object} params
 * @param {File} params.file - File cần upload
 * @param {string} params.ownerId - ID chủ sở hữu
 * @param {string} params.ownerType - Loại chủ sở hữu (DU_AN, HOP_DONG, PHU_LUC, etc.)
 * @param {string} params.parentId - ID cha
 * @param {string} params.name - Tên file
 * @param {string} params.description - Mô tả file
 * @param {Object} params.additionalData - Dữ liệu bổ sung (optional)
 * @returns {Promise<Object>} Kết quả trả về từ API
 */
export const uploadFile = async ({ file, ownerId, ownerType, parentId, name, description, additionalData = {} }) => {
  try {
    // Tạo FormData để upload multipart
    const formData = new FormData();

    // Append file (binary data)
    formData.append('file', file);

    // Append metadata
    formData.append('owner_id', ownerId);
    formData.append('owner_type', ownerType);
    formData.append('parent_id', parentId || '');
    formData.append('name', name || file.name);
    formData.append('description', description || `File upload - ${file.name}`);

    // Append additional data
    Object.keys(additionalData).forEach((key) => {
      formData.append(key, additionalData[key]);
    });

    const { rc } = await http.post('/auth/document/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (rc?.code !== 0) {
      throw new Error(rc?.desc || 'Không thể upload file');
    }

    return rc.code;
  } catch (error) {
    throw error;
  }
};

/**
 * Hàm xóa file chung
 * @param {Object} params
 * @param {string} params.ownerId - ID chủ sở hữu
 * @param {string} params.ownerType - Loại chủ sở hữu (DU_AN, HOP_DONG, PHU_LUC, etc.)
 * @param {string} params.id - ID file cần xóa
 * @param {Object} params.additionalData - Dữ liệu bổ sung (optional)
 * @returns {Promise<Object>} Kết quả trả về từ API
 */
export const deleteFile = async ({ ownerId, ownerType, id }) => {
  try {
    const body = {
      owner_id: ownerId,
      owner_type: ownerType,
      id,
    };

    const { rc } = await http.delete('/auth/document', {
      data: body,
    });

    if (rc?.code !== 0) {
      throw new Error(rc?.desc || 'Không thể xóa file');
    }
    return rc.code;
  } catch (error) {

    throw error;
  }
};

/**
 * Lấy danh sách tài liệu và hình ảnh theo owner_id và owner_type
 * @param {Object} params
 * @param {string} params.ownerId - ID chủ sở hữu
 * @param {string} params.ownerType - Loại chủ sở hữu (DU_AN, HOP_DONG, PHU_LUC, etc.)
 * @returns {Promise<Object>} Danh sách tài liệu và hình ảnh
 */
export const getDocumentList = async ({ ownerId, ownerType }) => {
  try {
    const body = {
      owner_id: ownerId,
      owner_type: ownerType,
    };

    const { rc, rootNode } = await http.post('/auth/document/list', body);
    if (rc?.code !== 0) {
      throw new Error(rc?.message || 'Không thể tải danh sách tài liệu');
    }
    return rootNode;
  } catch (error) {
    console.error('Get document list error:', error);
    notification.error({
      message: 'Lỗi',
      description: error?.response?.data?.message || 'Không thể tải danh sách tài liệu',
    });
    throw error;
  }
};

/**
 * Lấy danh sách tài liệu dự án
 */
export const getProjectDocuments = async (projectId) => {
  return getDocumentList({
    ownerId: projectId,
    ownerType: 'DU_AN',
  });
};

/**
 * Upload ảnh dự án
 */
export const uploadProjectImage = async (file, projectId, parentId, name = '', description = '') => {
  return uploadFile({
    file,
    ownerId: projectId,
    ownerType: 'DU_AN',
    parentId: parentId,
    name: name || file.name,
    description: description || `Hình ảnh dự án - ${file.name}`,
  });
};

/**
 * Upload tài liệu dự án
 */
export const uploadProjectDocument = async (file, projectId, parentId, name = '', description = '') => {
  return uploadFile({
    file,
    ownerId: projectId,
    ownerType: 'DU_AN',
    parentId: parentId,
    name: name || file.name,
    description: description || `Tài liệu dự án - ${file.name}`,
  });
};

/**
 * Upload hợp đồng
 */
export const uploadContract = async (file, contractId, name = '', description = '') => {
  return uploadFile({
    file,
    ownerId: contractId,
    ownerType: 'HOP_DONG',
    parentId: contractId,
    name: name || file.name,
    description: description || `Hợp đồng - ${file.name}`,
    additionalData: {
      category: 'CONTRACT',
      file_type: file.type,
      file_size: file.size,
    },
  });
};

/**
 * Upload phụ lục hợp đồng
 */
export const uploadContractAppendix = async (file, contractId, appendixId, name = '', description = '') => {
  return uploadFile({
    file,
    ownerId: appendixId,
    ownerType: 'PHU_LUC',
    parentId: contractId,
    name: name || file.name,
    description: description || `Phụ lục hợp đồng - ${file.name}`,
    additionalData: {
      category: 'CONTRACT_APPENDIX',
      contract_id: contractId,
      file_type: file.type,
      file_size: file.size,
    },
  });
};

/**
 * Xóa ảnh dự án
 */
export const deleteProjectImage = async (imageId, projectId) => {
  return deleteFile({
    ownerId: projectId,
    ownerType: 'DU_AN',
    id: imageId,
  });
};

/**
 * Xóa tài liệu dự án
 */
export const deleteProjectDocument = async (documentId, projectId) => {
  return deleteFile({
    ownerId: projectId,
    ownerType: 'DU_AN',
    id: documentId,
  });
};

/**
 * Xóa hợp đồng
 */
export const deleteContract = async (contractId, ownerId) => {
  return deleteFile({
    ownerId: ownerId,
    ownerType: 'HOP_DONG',
    id: contractId,
  });
};

/**
 * Xóa phụ lục hợp đồng
 */
export const deleteContractAppendix = async (appendixId, contractId) => {
  return deleteFile({
    ownerId: contractId,
    ownerType: 'PHU_LUC',
    id: appendixId,
  });
};
