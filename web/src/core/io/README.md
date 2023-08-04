# IO

加载资源用的。主要是为了把加载的资源缓存到 indexedDB，下次直接从 indexedDB 读取。

indexedDB 可以在 worker 中使用。但 localStorage 之类的不可以。

