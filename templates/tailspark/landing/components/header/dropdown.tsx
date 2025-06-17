import { Menu, Transition } from "@headlessui/react";
import { EllipsisVerticalIcon } from "@heroicons/react/20/solid";
import { Fragment } from "react";
import { useRouter } from "next/navigation";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

// 한글 주석: DropDown 컴포넌트가 user, 로그인/로그아웃 핸들러, router를 props로 받도록 수정
export default function DropDown({ user, handleGoogleLogin, handleLogout }: {
  user: any;
  handleGoogleLogin: () => void;
  handleLogout: () => void;
}) {
  const router = useRouter();
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="mt-1.5 flex items-center rounded-full bg-gray-100 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100">
          <span className="sr-only">Open options</span>
          <EllipsisVerticalIcon className="h-6 w-6" aria-hidden="true" />
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            {/* 한글 주석: 로그인/로그아웃 메뉴 */}
            <Menu.Item>
              {({ active }) => (
                user ? (
                  <a
                    href="#"
                    onClick={e => { e.preventDefault(); handleLogout(); }}
                    className={classNames(
                      active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                      "block px-4 py-2 text-sm w-full text-left"
                    )}
                  >
                    {/* 한글 주석: 로그아웃 클릭 시 handleLogout 실행 */}
                    로그아웃
                  </a>
                ) : (
                  <a
                    href="#"
                    onClick={e => { e.preventDefault(); handleGoogleLogin(); }}
                    className={classNames(
                      active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                      "block px-4 py-2 text-sm w-full text-left"
                    )}
                  >
                    {/* 한글 주석: 구글로 로그인 클릭 시 handleGoogleLogin 실행 */}
                    구글로 로그인
                  </a>
                )
              )}
            </Menu.Item>
            {/* 한글 주석: 카테고리 메뉴 */}
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={() => router.push('/categories')}
                  className={classNames(
                    active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                    "block px-4 py-2 text-sm w-full text-left"
                  )}
                >
                  카테고리
                </button>
              )}
            </Menu.Item>
            {/* 한글 주석: 서버 등록 메뉴 */}
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={() => router.push('/register-mcp')}
                  className={classNames(
                    active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                    "block px-4 py-2 text-sm w-full text-left"
                  )}
                >
                  서버 등록
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
