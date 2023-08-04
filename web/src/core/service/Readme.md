# core/service

core/service 目录为工具服务的核心部分，UI 部分会基于此构建。

service/xxx/ 下的文件：

--index.ts 是工具服务的入口，功能导出文件。UI 会调用这个文件使用功能。

--utils.ts 是内部工具文件（当然，其他地方也可以调用。但通用的函数更建议放在 core 下的 utils 里）。

—-worker.ts 是多线程文件。该文件会被 index.ts 引入。

--schema.ts 是服务概要文件，实际上就是用一个对象表示服务提供的功能。该文件每个服务都要有，可以描述丰富，提供可编排功能，也可以只包含名称、图标、描述。

--data-types.ts 是服务特有的数据类型——用于 schema input 和 output，不是函数实际的输出格式。
