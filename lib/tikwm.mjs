function absTikwm(p) {
  if (!p) return null;
  return p.startsWith('http') ? p : `https://www.tikwm.com${p}`;
}

export function tikwmResult(json) {
  if (json.code !== 0 || !json.data) throw new Error(json.msg || 'tikwm 解析失败');
  const d = json.data;

  const formats = [];
  if (d.hdplay)
    formats.push({ kind: 'hd_nowm', label: '高清无水印 · MP4', type: 'video', url: absTikwm(d.hdplay) });
  if (d.play)
    formats.push({ kind: 'nowm', label: '无水印 · MP4', type: 'video', url: absTikwm(d.play) });
  // 不提供带水印格式：对齐 SSSTik 的产品口径（用户要的就是无水印），
  // 且 tikwm 的 wmplay 缓存链接失效率最高
  if (formats.length === 0) throw new Error('tikwm 未返回可用格式');

  return {
    provider: 'tikwm',
    id: String(d.id || ''),
    title: d.title || '',
    cover: absTikwm(d.cover) || absTikwm(d.origin_cover),
    duration: Number(d.duration) || 0,
    author: {
      name: d.author?.nickname || '',
      uniqueId: d.author?.unique_id || '',
      avatar: absTikwm(d.author?.avatar),
    },
    formats,
  };
}

