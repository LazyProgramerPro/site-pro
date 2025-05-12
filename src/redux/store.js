import acceptanceRequestReducer from '@/pages/acceptance-request/redux/acceptanceRequest.slice';
import accountReducer from '@/pages/account/redux/account.slice';
import userReducer from '@/pages/auth/redux/user.slice';
import businessReducer from '@/pages/business/redux/business.slice';
import businessUserReducer from '@/pages/business/redux/business-user.slice';
import categoryReducer from '@/pages/category/redux/category.slice';
import constructionDiaryReducer from '@/pages/construction-diary/redux/constructionDiary.slice';
import constructionReducer from '@/pages/construction/redux/construction.slice';
import contractReducer from '@/pages/contract/redux/contract.slice';
import contractAddendumReducer from '@/pages/contract/redux/contractAddendum.slide';
import groupReducer from '@/pages/group/redux/group.slice';
import problemReducer from '@/pages/problem/redux/problem.slice';
import projectReducer from '@/pages/project/redux/project.slice';
import { configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';

export const store = configureStore({
  reducer: {
    // Add other reducers here if needed
    user: userReducer,
    account: accountReducer,
    role: groupReducer,
    business: businessReducer,
    businessUser: businessUserReducer,
    construction: constructionReducer,
    category: categoryReducer,
    group: groupReducer,
    project: projectReducer,
    problem: problemReducer,
    contract: contractReducer,
    contractAddendum: contractAddendumReducer,
    acceptanceRequest: acceptanceRequestReducer,
    constructionDiary: constructionDiaryReducer,
  },
});

// Lấy RootState và AppDispatch từ store của chúng ta.
// Note: Type definitions removed in JS version
export const useAppDispatch = () => useDispatch();
