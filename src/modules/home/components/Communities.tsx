'use client';

import {
  Button,
  CSFlowerCheck,
  CSMagnifest,
  CSPlus,
  CSSpecialIcon1,
  Img,
} from '@/components';
import { VARIABLE_CONSTANT } from '@/constants';
import Link from 'next/link';

export function Communities() {
  return (
    <aside className="sticky flex-1 top-0 z-10 pt-6 left-0 min-w-[320px] max-w-custom-1 ">
      <div className="py-4 px-2 flex flex-col  bg-white  rounded-xl min-h-[200px]">
        <div className="flex flex-col flex-wrap gap-y-1 px-2 pb-1">
          <div className="flex h-10 flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-base font-semibold text-neutral-60">
                Your communities
              </span>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  className="size-8 rounded-lg bg-customGray-2 hover:bg-customPurple-3"
                >
                  <div className="size-5 [&>svg>path]:fill-neutral-60">
                    <CSMagnifest className="w-5 h-5" />
                  </div>
                </Button>
                <Button
                  type="button"
                  className="size-8 rounded-lg bg-customGray-2 hover:bg-customPurple-3"
                >
                  <div className="size-5 [&>svg>path]:fill-neutral-60">
                    <CSPlus className="w-5 h-5" />
                  </div>
                </Button>
              </div>
            </div>
          </div>
        </div>
        {/* SCROLL */}
        <div className="flex flex-col overflow-y-auto overscroll-contain">
          <div className="group relative flex cursor-pointer gap-x-2 rounded-lg bg-white hover:rounded-lg hover:bg-neutral-2">
            <Link
              className="flex-1"
              href="#"
            >
              <div className="flex items-center gap-2 p-2">
                <div className="w-[30px] h-[30px] aspect-square">
                  <Img
                    src={VARIABLE_CONSTANT.SHORT_LOGO_2}
                    className="w-full h-full rounded-lg"
                    fit="cover"
                  />
                </div>
                <div className="flex items-center gap-1">
                  <div className="size-5">
                    <CSSpecialIcon1 />
                  </div>
                  <span className="line-clamp-1 break-all text-sm font-semibold linear-text group-hover:line-clamp-1">
                    Beincom Việt Nam
                  </span>
                  <div className="size-4 [&>svg>path]:fill-customPurple-4">
                    <CSFlowerCheck />
                  </div>
                </div>
              </div>
            </Link>
          </div>
          {/* <div className="px-2 h-px shrink-0 w-full border border-customGray-1 my-1" /> */}
        </div>
      </div>
    </aside>
  );
}
