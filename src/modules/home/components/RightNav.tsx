'use client';

import { Button, CSBlock, Img } from '@/components';
import {
  DUMMY_MENU_ARR,
  DUMMY_SERVICE_ARR,
  VARIABLE_CONSTANT,
} from '@/constants';

export function RightNav() {
  return (
    <aside className=" sticky top-0 z-10 pt-6 left-0 min-w-[320px] max-w-custom-1 flex flex-col gap-6">
      {/* SERVICE */}
      <div className="bg-white rounded-xl min-h-[200px]">
        <div className="flex gap-2 px-4 pt-2">
          <div className="w-20 min-w-20 max-w-20 flex-none">
            <div className="flex w-full items-center gap-1 text-[10px] text-neutral-30 opacity-100">
              Airdrop Medals
            </div>
            <div className="flex w-full flex-col text-neutral-60">
              <span className="cursor-pointer truncate font-semibold text-sm">
                0
              </span>
            </div>
          </div>
          <div className="flex-1">
            <div className="flex w-full items-center gap-1 text-[10px] text-neutral-30 opacity-100 whitespace-nowrap">
              Estimated Conversion
            </div>
            <div className="flex w-full flex-col text-neutral-60">
              <span className="cursor-pointer truncate font-semibold text-sm">
                0 $BIC
              </span>
            </div>
          </div>
          <div className="h-12">
            <Img
              src={VARIABLE_CONSTANT.MEDAL}
              className="w-auto h-full"
              fit="cover"
            />
          </div>
        </div>
        <div className="h-px w-full bg-customGray-1 my-2" />
        <div className="px-4 pb-2">
          <p className="h-auto w-full pb-3 text-xs font-normal text-[#444F8E]">
            Complete all steps below to be eligible for the Airdrop.
          </p>
          <div className="flex w-full flex-col gap-y-[10px]">
            {DUMMY_SERVICE_ARR.map((ser, indx) => (
              <div
                className="flex items-center justify-between"
                key={ser.id}
              >
                <span className="text-xs font-medium text-customBlack-1">
                  {indx + 1}. {ser.title}
                </span>
                {ser.status === 'active' ? (
                  <Button className="!px-2 !py-0 bg-customBlue-1 hover:bg-customBlue-2 transition-colors rounded-md text-xs font-medium min-h-6 min-w-[72px]">
                    {ser.action}
                  </Button>
                ) : (
                  <div className="flex items-center gap-2">
                    <div className="size-4 [&>svg>path]:fill-customBlue-3">
                      <CSBlock />
                    </div>
                    <Button className="!px-2 !py-0 bg-customGray-1 hover:bg-customGray-1 transition-colors cursor-not-allowed rounded-md text-xs font-medium min-h-6 min-w-[72px]">
                      {ser.action}
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* EVENT */}
      <div className="relative w-full  h-full rounded-lg bg-white p-4 text-center">
        <div className="absolute inset-0 w-full h-[192px] z-0">
          <Img
            src={VARIABLE_CONSTANT.EVENT_BANNER_2}
            className="w-full h-full"
            fit="cover"
          />
        </div>
        <div className="relative z-1 flex flex-col gap-y-4 ">
          <div className="flex w-[154px] flex-col pb-2 text-left text-white">
            <span className="text-[14.4px] font-semibold leading-[21.6px] [-webkit-text-stroke:0.12px_#FFF] ">
              Get Premium to boost your Medals
            </span>
            <div className="pt-2 text-[10px] font-normal leading-[15px]">
              Your chance to boost your Medals and get special benefits from
              premium features.
            </div>
          </div>
          <Button className="w-full !text-customPurple-1 bg-customGray-3 hover:bg-customPurple-5 !py-2 !px-4 min-h-6 text-base font-medium rounded-md">
            Upgrade
          </Button>
        </div>
      </div>
      {/* MENU */}
      <div className="rounded-lg bg-white p-2">
        <div className="relative flex flex-col gap-2">
          {DUMMY_MENU_ARR.map((menu) => (
            <div key={menu.id}>
              <div className="p-2 text-base font-semibold text-neutral-60">
                {menu.title}
              </div>

              <ul>
                {menu.children?.map((child, idx) => (
                  <li
                    key={child.id}
                    className="relative py-1 pl-6 pr-2"
                  >
                    <span
                      className={`absolute left-0 border-l border-neutral-300 ${
                        idx === 0
                          ? 'top-1/2 h-1/2'
                          : idx === menu.children.length - 1
                          ? 'top-0 h-1/2'
                          : 'top-0 h-full'
                      }`}
                    ></span>
                    <span className="absolute left-0 top-1/2 w-3 border-t border-neutral-300"></span>
                    <span className="line-clamp-1 w-full break-all text-sm font-normal text-neutral-60 hover:underline">
                      {child.title}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
