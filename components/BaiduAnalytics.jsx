export default function BaiduAnalytics() {
  return (
    <script
      id="baidu-analytics"
      dangerouslySetInnerHTML={{
        __html: `
var _hmt = _hmt || [];
(function() {
  var hm = document.createElement("script");
  hm.src = "https://hm.baidu.com/hm.js?182bf063b6f12b116b8046cfec941026";
  var s = document.getElementsByTagName("script")[0];
  s.parentNode.insertBefore(hm, s);
})();
`,
      }}
    />
  );
}
