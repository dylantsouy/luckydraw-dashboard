import React from 'react';
import ReactDOM from 'react-dom/client';
import { act } from 'react-dom/test-utils';
import renderer from 'react-test-renderer';
import DropUpload from './DropUpload';

function renderInit(props) {
    ReactDOM.createRoot(container).render(<DropUpload {...props} />);
}

let container;

beforeEach(() => {
    // setup a DOM element as a render target
    container = document.createElement('div');
    document.body.appendChild(container);
});

afterEach(() => {
    // cleanup on exiting
    document.body.removeChild(container);
    container = null;
});

describe('DropUpload', () => {
    it('test DropUpload show correctly with valid', async () => {
        act(() => {
            renderInit({
                validation: {
                    file: { valid: true, error: '' },
                },
                percentage: 0,
                disabled: false,
                setPercentage: jest.fn(),
                setError: jest.fn(),
                setAddData: jest.fn(),
            });
        });
        expect(container.querySelector('.error')).toBeNull();
        expect(container.querySelector('.warn')).toBeNull();
        expect(container.querySelector('.placeholder-top').textContent).toBe('拖拉檔案至此或 點擊此處上傳');
        expect(container.querySelector('.placeholder-bottom').textContent).toBe('只接受檔案類型為 .zip or .bin');
    });

    it('test DropUpload show correctly with valid failed', async () => {
        act(() => {
            renderInit({
                validation: {
                    file: { valid: false, error: 'error message' },
                },
                percentage: 2,
                disabled: true,
                setPercentage: jest.fn(),
                setError: jest.fn(),
                setAddData: jest.fn(),
            });
        });
        expect(container.querySelector('.error').textContent).toBe('error message');
        expect(container.querySelector('.warn')).not.toBeNull();
        expect(container.querySelector('.disabled')).not.toBeNull();
    });
    it('toMatchSnapshot', () => {
        const props = {
            validation: {
                file: { valid: false, error: 'error message' },
            },
            percentage: 2,
            disabled: true,
            setPercentage: jest.fn(),
            setError: jest.fn(),
            setAddData: jest.fn(),
        };
        const tree = renderer.create(<DropUpload {...props} />).toJSON();
        expect(tree).toMatchSnapshot();
    });
});
