import { promises as fs } from 'fs';
import { join } from 'path';

async function run() {
  const { default: git } = await import('isomorphic-git');
  const { default: http } = await import('isomorphic-git/http/node');

  const dir = '.';
  
  try {
    console.log('检查git状态...');
    const status = await git.status({ fs, dir });
    console.log('当前状态:', status);
    
    if (status.length === 0) {
      console.log('没有需要提交的文件');
      return;
    }
    
    console.log('添加所有文件...');
    await git.add({ fs, dir, filepath: '.' });
    
    console.log('提交代码...');
    const commitMessage = 'feat: 更新首页功能，实现高级/低级权限视图切换';
    await git.commit({ fs, dir, message: commitMessage });
    
    console.log('推送代码到远程仓库...');
    await git.push({ 
      fs, 
      dir, 
      http,
      remote: 'origin',
      ref: 'main',
      onAuth: () => ({
        username: '',
        password: ''
      })
    });
    
    console.log('部署成功！');
  } catch (error) {
    console.error('部署失败:', error);
    process.exit(1);
  }
}

run();