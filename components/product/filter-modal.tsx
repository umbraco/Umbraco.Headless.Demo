'use client';

import { Dialog, Transition } from '@headlessui/react';
import { AdjustmentsVerticalIcon, XMarkIcon } from '@heroicons/react/24/outline';
import TagButton from 'components/tag-button';
import { defaultSort, sorting } from 'lib/constants';
import { createUrl } from 'lib/utils';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Fragment, useEffect, useRef, useState } from 'react';

export default function FilterModal({ tags }: { tags: string[] }) {
  const pathname = usePathname();
  const currentParams = useSearchParams();
  const router = useRouter();

  let searchInputRef = useRef(null);

  // Create params collection for just supported filter keys
  const filterKeys = ['q', 'tag', 'sort'];

  // Setup state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedSortOrder, setSelectedSortOrder] = useState(defaultSort);
  const [selectedParams, setSelectedParams] = useState(new URLSearchParams());
  const [isOpen, setIsOpen] = useState(false);

  // Watch for changes
  useEffect(() => {
    const newParams = new URLSearchParams(selectedParams);

    // Handle search term
    if (searchTerm) {
      newParams.set('q', searchTerm);
    } else {
      newParams.delete('q');
    }

    // Handle tags
    if (selectedTags.length > 0) {
      newParams.set('tag', selectedTags.join(','));
    } else {
      newParams.delete('tag');
    }

    // Handle sort order
    if (selectedSortOrder?.slug) {
      newParams.set('sort', selectedSortOrder.slug);
    } else {
      newParams.delete('sort');
    }

    // Update selected params
    setSelectedParams(newParams);
  }, [searchTerm, selectedTags, selectedSortOrder]);

  useEffect(() => {
    setIsOpen(false);
  }, [currentParams]);

  useEffect(() => {
    reset();
  }, []);

  useEffect(() => {
    if (isOpen) {
      syncFromQuerystring();
    }
  }, [isOpen]);

  // Add or remove tag from selected tags
  function tagClickHandler(tag: string) {
    const exists = selectedTags.includes(tag);
    if (exists) {
      setSelectedTags(selectedTags.filter((x) => x != tag));
    } else {
      setSelectedTags([tag, ...selectedTags]);
    }
  }

  function reset() {
    setSearchTerm('');
    setSelectedTags([]);
    setSelectedSortOrder(defaultSort);
  }

  function clearFilterHandler() {
    router.push(pathname);
    setIsOpen(false);
  }

  function applyFilterHandler() {
    router.push(createUrl(pathname, selectedParams));
    setIsOpen(false);
  }

  function onSearchKeyDown(key: string) {
    if (key === 'Enter') {
      applyFilterHandler();
    }
  }

  function syncFromQuerystring() {
    const initSelectedParams = new URLSearchParams();
    filterKeys.forEach((key) => {
      const v = currentParams.get(key);
      if (v) {
        initSelectedParams.set(key, v);
      }
    });

    // Lookup the default sort
    const initSortParam = initSelectedParams.get('sort');
    const initSort = initSortParam
      ? sorting.find((x) => x.slug == initSortParam) || defaultSort
      : defaultSort;

    // Lookup the default tags
    const initTags = initSelectedParams.get('tag')?.split(',') || [];

    setSearchTerm(initSelectedParams?.get('q') || '');
    setSelectedTags(initTags);
    setSelectedSortOrder(initSort);
    setSelectedParams(initSelectedParams);
  }

  return (
    <>
      <button
        className="fixed bottom-28 right-4 z-20 flex h-20 w-20 items-center justify-center rounded-full bg-umb-blue transition-colors hover:bg-umb-blue-active lg:bottom-36 lg:right-8 lg:h-24 lg:w-24 "
        aria-label="Open filter settings"
        onClick={() => setIsOpen(true)}
      >
        <AdjustmentsVerticalIcon className="h-10 w-10 text-white lg:h-12 lg:w-12" />
      </button>

      <Transition show={isOpen}>
        <Dialog
          onClose={() => setIsOpen(false)}
          initialFocus={searchInputRef}
          className="relative z-50"
        >
          <Transition.Child
            as={Fragment}
            enter="transition-all ease-in-out duration-300"
            enterFrom="opacity-0 backdrop-blur-none"
            enterTo="opacity-100 backdrop-blur-[.5px]"
            leave="transition-all ease-in-out duration-200"
            leaveFrom="opacity-100 backdrop-blur-[.5px]"
            leaveTo="opacity-0 backdrop-blur-none"
          >
            <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
          </Transition.Child>
          <Transition.Child
            as={Fragment}
            enter="transition-all ease-in-out duration-300"
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leave="transition-all ease-in-out duration-200"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
          >
            <Dialog.Panel className="fixed bottom-0 right-0 top-0 flex h-screen w-full flex-col bg-umb-gray text-black md:w-4/5 lg:w-3/5 xl:w-1/2">
              <div className="flex items-center justify-between border-b border-gray-200 bg-white p-4 md:p-8">
                <Dialog.Title className="text-2xl font-bold md:text-3xl">
                  Filter Products
                </Dialog.Title>
                <button
                  aria-label="Close filter settings"
                  onClick={() => setIsOpen(false)}
                  className="text-black transition-opacity hover:opacity-50"
                >
                  <XMarkIcon className="h-10 stroke-2 md:h-12" />
                </button>
              </div>

              <div className="flex flex-1 flex-col gap-8 overflow-y-auto p-4 md:p-8">
                <div className="relative">
                  <input
                    type="text"
                    className="form-input w-full rounded border-gray-300 text-lg outline-umb-blue"
                    placeholder="Search..."
                    ref={searchInputRef}
                    autoComplete="off"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => onSearchKeyDown(e.key)}
                  ></input>
                  <button
                    aria-label="Clear search"
                    onClick={() => setSearchTerm('')}
                    className={
                      'absolute right-4 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full bg-stb-5 text-black outline-umb-blue transition-colors hover:bg-stb-15'
                    }
                  >
                    <XMarkIcon className="h-5 stroke-2" />
                  </button>
                </div>
                <div>
                  <h5 className={'mb-2 text-lg font-bold'}>Tags</h5>
                  <div className="flex w-full flex-wrap items-center gap-4">
                    {tags.map((tag) => (
                      <TagButton
                        key={tag}
                        selected={selectedTags.includes(tag)}
                        onClick={() => tagClickHandler(tag)}
                      >
                        <span>{tag}</span>
                      </TagButton>
                    ))}
                  </div>
                </div>
                <div>
                  <h5 className={'mb-2 text-lg font-bold'}>Sort By</h5>
                  <select
                    value={selectedSortOrder?.slug || ''}
                    onChange={(e) =>
                      setSelectedSortOrder(sorting.find((s) => s.slug === e.target.value)!)
                    }
                    className="form-select w-full rounded border-gray-300 text-lg outline-umb-blue"
                  >
                    {sorting.map((itm) => (
                      <option key={itm.title} value={itm.slug}>
                        {itm.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="sticky bottom-0 left-0 right-0 flex flex-col gap-2 border-t border-gray-200 bg-white p-4 md:flex-row md:gap-4 md:p-8">
                <button
                  type="button"
                  className="btn btn-lg btn-outline border-umb-blue text-umb-blue md:flex-1"
                  onClick={() => clearFilterHandler()}
                >
                  Clear
                </button>
                <button
                  type="button"
                  className="btn btn-lg bg-umb-green text-white hover:bg-umb-green-active md:w-3/4"
                  onClick={() => applyFilterHandler()}
                >
                  Apply
                </button>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </Dialog>
      </Transition>
    </>
  );
}
