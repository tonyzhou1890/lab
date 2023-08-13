module.exports = {
  apps: [
    {
      name: 'snowlab-web',
      script: './index.js',
      watch: '.',
      ignore_watch: ['node_modules', 'build', 'logs', 'test'],
      out_file: './logs/out.log', // 日志输出
      error_file: './logs/error.log', // 错误日志
      max_memory_restart: '2G', // 超过多大内存自动重启，仅防止内存泄露，根据自己的业务设置
      exec_mode: 'cluster', // 开启多线程模式，用于负载均衡
      instances: 1, // 启用多少个实例，可用于负载均衡
      autorestart: true, // 程序崩溃后自动重启
      env: {
        PORT: 8650,
      },
    },
  ],
}
