declare global {
  namespace jest {
    interface Matchers<R> {
      toBeCloseTo(expected: number, precision?: number): R;
      toBe(expected: any): R;
      toEqual(expected: any): R;
      toThrow(expected?: string | Error | RegExp): R;
      toHaveBeenCalledWith(...args: any[]): R;
    }

    type MockableFunction = (...args: any[]) => any;
    
    interface MockWithArgs<T extends MockableFunction> extends MockableFunction {
      new (...args: any[]): T;
      (...args: Parameters<T>): ReturnType<T>;
      mockClear(): void;
      mockReset(): void;
      mockImplementation(fn: (...args: Parameters<T>) => ReturnType<T>): this;
      mockImplementationOnce(fn: (...args: Parameters<T>) => ReturnType<T>): this;
      mockReturnValue(value: ReturnType<T>): this;
      mockReturnValueOnce(value: ReturnType<T>): this;
      mockResolvedValue<U extends Promise<unknown>>(value: Awaited<U>): this;
      mockResolvedValueOnce<U extends Promise<unknown>>(value: Awaited<U>): this;
      mockRejectedValue(value: unknown): this;
      mockRejectedValueOnce(value: unknown): this;
    }

    type Mocked<T> = {
      [P in keyof T]: T[P] extends MockableFunction ? MockWithArgs<T[P]> : T[P];
    };

    function fn<T extends MockableFunction>(implementation?: T): MockWithArgs<T>;
    function mock<T>(moduleName: string): { [K in keyof T]: jest.Mocked<T[K]> };
    function clearAllMocks(): void;
  }

  function describe(name: string, fn: () => void): void;
  function beforeEach(fn: () => void): void;
  function it(name: string, fn: () => void | Promise<void>): void;
  function expect<T>(value: T): jest.Matchers<void>;
}

export { }; 