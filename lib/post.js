import path from "path";
import fs from "fs";
import matter from "gray-matter";
import { remark } from "remark";
import { html} from "remark-html";

const postsDirectory = path.join(process.cwd(), "posts");

//mdファイルのデータを取り出す
export function getPostsData() {
  const fileName = fs.readdirSync(postsDirectory);
  const allPostsData = fileName.map((fileName) => {
    const id = fileName.replace(/\.md$/, ""); //ファイル名
    //マークダウンファイルを文字列として取り出す
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const matterResult = matter(fileContents);

    //idとデータを返す
    return {
      id,
      ...matterResult.data,
    };
  });

  return allPostsData;
}

//getStaticPathでreturnで使うpathを取得する
//わかりづらいので公式ドキュメントで復習

export function getAllPostsIds() {
  const fileName = fs.readdirSync(postsDirectory);
  return fileName.map((fileName) => {
    return {
      params : {
        id: fileName.replace(/\.md$/, ""),
      },
    };
  });
  /*
    [
      {
        params : {
          id : "ssg-ssr"
        }
      },
      {
        params : {
          id : "next-react"
        }
      }
    ]
  */
}

//idに基づいてブログ投稿データを返す
export async function getPostData(id) {
  const fullPath = path.join(postsDirectory, `${id}.md`);
  const fileContent = fs.readFileSync(fullPath, "utf-8");

  const matterResult = matter(fileContent);

  const blogContent = await remark()
  .use(html)
  .process(matterResult.content);
  
  const blogContentHTML = blogContent.toString();

  return {
    id,
    blogContentHTML,
    ...matterResult.data,
  };
}
