import React from 'react';
import {UserData} from '@entity/UserData';

const mockUser: UserData = {
	id: 1,
	email: 'test@example.com',
	isVerified: true,
	lastLogin: new Date()
};

export const mockedSetUser: jest.Mock = jest.fn();
export const mockedSetLoaded: jest.Mock = jest.fn();
export const mockedRefreshUser: jest.Mock = jest.fn();

export const mockedUseUserData: jest.Mock = jest.fn();
export const mockedUseUserDataActions: jest.Mock = jest.fn();

mockedUseUserData.mockReturnValue({
	user: mockUser,
	loaded: true
});

mockedUseUserDataActions.mockReturnValue({
	setUser: mockedSetUser,
	setLoaded: mockedSetLoaded,
	refreshUser: mockedRefreshUser
});

jest.mock('@context/UserDataContext', () => ({
	useUserData: mockedUseUserData,
	useUserDataActions: mockedUseUserDataActions,
	UserDataProvider: (props: React.PropsWithChildren): React.ReactNode => props.children
}));
