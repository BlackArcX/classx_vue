<template>
  <div>
    <header class="bg-surface shadow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-center sm:items-stretch sm:justify-start h-20">
        <div class="flex-shrink-0 flex items-center">
          <div class="h-10 w-10 mr-3 bg-primary rounded-full flex items-center justify-center">
            <svg class="text-on-primary h-5 w-5" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
            </svg>
          </div>
        </div>
        <div class="min-w-0 flex-1 flex flex-col justify-center">
          <div class="text-sm leading-5 font-medium text-on-surface truncate">Data Structures & algorithm</div>
          <div class="mt-1 text-sm leading-5 text-on-surface-60 truncate">CSC231 - Dr. Farukh Zeeshan</div>
        </div>
<!--        <div class="hidden sm:ml-6 sm:flex">-->
<!--          <a href="#" class="inline-flex items-center px-1 pt-1 border-b-2 border-accent text-sm font-medium leading-5 text-primary-dark focus:outline-none focus:border-indigo-700 transition duration-150 ease-in-out">-->
<!--            Resources-->
<!--          </a>-->
<!--          <a href="#" class="ml-8 inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium leading-5 text-primary-light hover:text-primary-dark hover:border-gray-300 focus:outline-none focus:text-primary-dark focus:border-gray-300 transition duration-150 ease-in-out">-->
<!--            Tasks-->
<!--          </a>-->
<!--          <a href="#" class="ml-8 inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium leading-5 text-primary-light hover:text-primary-dark hover:border-gray-300 focus:outline-none focus:text-primary-dark focus:border-gray-300 transition duration-150 ease-in-out">-->
<!--            About-->
<!--          </a>-->
<!--        </div>-->
      </div>
    </header>

    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 class="text-lg leading-6 font-medium text-on-surface py-3 mt-4">Resources</h1>

      <div class="bg-surface shadow overflow-hidden sm:rounded-md">
        <ul>
          <li class="border-t border-border-75">
            <div class="flex items-center px-4 py-4 sm:px-6">
              <div class="flex-shrink-0">
                <img src="../../public/img/file-icons/doc.svg" class="mr-4 w-8">
              </div>
              <div class="min-w-0 flex-1 flex flex-col">
                <div class="text-sm leading-5 font-medium text-on-surface truncate">Lecture 1 Slides</div>
                <div class="mt-1 text-sm leading-5 text-on-surface-60 truncate">February 23rd, 2020</div>
              </div>
              <div class="flex">
                <a href="#" class="text-on-surface-60 hover:text-on-surface">
                  <svg class="h-6 w-6" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                  </svg>
                </a>
              </div>
            </div>
          </li>
          <li class="border-t border-border-75">
            <div class="flex items-center px-4 py-4 sm:px-6">
              <div class="flex-shrink-0">
                <img src="../../public/img/file-icons/xls.svg" class="mr-4 w-8">
              </div>
              <div class="min-w-0 flex-1 flex flex-col">
                <div class="text-sm leading-5 font-medium text-on-surface truncate">Lecture 2 Slides</div>
                <div class="mt-1 text-sm leading-5 text-on-surface-60 truncate">February 23rd, 2020</div>
              </div>
              <div class="flex">
                <a href="#" class="text-on-surface-60 hover:text-on-surface">
                  <svg class="h-6 w-6" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                  </svg>
                </a>
              </div>
            </div>
          </li>
          <li class="border-t border-border-75">
            <div class="flex items-center px-4 py-4 sm:px-6">
              <div class="flex-shrink-0">
                <img src="../../public/img/file-icons/ppt.svg" class="mr-4 w-8">
              </div>
              <div class="min-w-0 flex-1 flex flex-col">
                <div class="text-sm leading-5 font-medium text-on-surface truncate">Lecture 3 Slides</div>
                <div class="mt-1 text-sm leading-5 text-on-surface-60 truncate">February 23rd, 2020</div>
              </div>
              <div class="flex">
                <a href="#" class="text-on-surface-60 hover:text-on-surface">
                  <svg class="h-6 w-6" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                  </svg>
                </a>
              </div>
            </div>
          </li>
          <li class="border-t border-border-75">
            <div class="flex items-center px-4 py-4 sm:px-6">
              <div class="flex-shrink-0">
                <img src="../../public/img/file-icons/pdf.svg" class="mr-4 w-8">
              </div>
              <div class="min-w-0 flex-1 flex flex-col">
                <div class="text-sm leading-5 font-medium text-on-surface truncate">Lecture 4 Slides</div>
                <div class="mt-1 text-sm leading-5 text-on-surface-60 truncate">February 23rd, 2020</div>
              </div>
              <div class="flex">
                <a href="#" class="text-on-surface-60 hover:text-on-surface">
                  <svg class="h-6 w-6" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                  </svg>
                </a>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
