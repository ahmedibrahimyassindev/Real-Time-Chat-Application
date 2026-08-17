<template>
  <main class="grid min-h-screen grid-rows-[56px_1fr] bg-slate-950">
    <header class="flex items-center border-b border-slate-800 px-6">
      <span class="text-sm font-semibold text-white">Real-Time Chat</span>
    </header>
    <div class="grid min-h-0 grid-cols-[260px_1fr]">
      <aside class="border-r border-slate-800 bg-slate-900 p-4">
        <p class="text-xs font-medium uppercase tracking-wide text-slate-500">Workspace</p>
      </aside>
      <slot />
    </div>
  </main>
</template>
