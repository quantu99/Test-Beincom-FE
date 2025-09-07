export const ClassicEditor = {
  create: jest.fn().mockResolvedValue({
    setData: jest.fn(),
    getData: jest.fn().mockReturnValue(''),
    destroy: jest.fn(),
  }),
};