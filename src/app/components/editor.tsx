import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { PlainTextPlugin } from "@lexical/react/LexicalPlainTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { EditorState, LexicalEditor } from "lexical";
import { $getRoot, $getSelection } from "lexical";

const theme = {
  // 테마 스타일링 설정
  // ...
  ltr: "ltr",
  rtl: "rtl",
  placeholder: "editor-placeholder",
  paragraph: "editor-paragraph",
};

function MyCustomAutoFocusPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    // 효과가 발생할 때 에디터에 포커스를 줍니다.
    // editor.focus();
  }, [editor]);

  return null;
}

function onError(error: any) {
  console.error(error);
}

interface Note {
  title: string;
  idx: number;
  content: string;
  subtitle: string;
  subMemoList: Array<{
    memosubtitle: string;
    memocontent: string;
    memoidx: number;
  }>;
}

interface NoteEditorProps {
  selectedIdx: number;
  memoList: Note[];
  screenMode: string;
}

export default function Editor({ selectedIdx, memoList, screenMode }: NoteEditorProps) {
  const [memoSubTitle, setMemoSubTitle] = useState("");
  const [memoContent, setMemoContent] = useState("");

  const selectedNote = useMemo(() => memoList.find((item: Note) => item.idx === selectedIdx), [memoList, selectedIdx]);

  // 애디터 초기 상태를 설정
  const CONTENT = JSON.stringify({
    root: {
      children: [
        {
          children: [
            {
              detail: 0,
              format: 0,
              mode: "normal",
              style: "",
              text:
                selectedNote?.subMemoList?.[0].memosubtitle && selectedNote?.subMemoList?.[0].memocontent
                  ? `${selectedNote?.subMemoList?.[0].memosubtitle}\n${selectedNote?.subMemoList?.[0].memocontent}`
                  : selectedNote?.subMemoList?.[0].memosubtitle || selectedNote?.subMemoList?.[0].memocontent || "",
              type: "text",
              version: 1,
            },
          ],
          direction: "ltr",
          format: "",
          indent: 0,
          type: "paragraph",
          version: 1,
        },
      ],
      direction: "ltr",
      format: "",
      indent: 0,
      type: "root",
      version: 1,
    },
  });

  const initialConfig = {
    namespace: "MyEditor",
    theme,
    editorState: CONTENT,
    onError,
    MyCustomAutoFocusPlugin,
  };

  // 에디터 입력 이벤트
  const handleContentChange = (EditorState: any) => {
    EditorState.read(() => {
      const root = $getRoot();
      if (root.__cachedText === null) return;
      if (root.__cachedText !== "") {
        const lines = root.__cachedText.split("\n");
        setMemoSubTitle(lines[0]);
        setMemoContent(lines.slice(1).join("\n"));

        if (selectedNote) {
          const loadSto = JSON.parse(localStorage.getItem("noteList") || "");

          const updatedNoteIndex = loadSto.findIndex((note: Note) => note.idx === selectedIdx);

          if (updatedNoteIndex !== -1) {
            loadSto[updatedNoteIndex] = {
              ...loadSto[updatedNoteIndex],
              subMemoList: [
                {
                  memosubtitle: memoSubTitle,
                  memocontent: memoContent,
                },
              ],
            };
          }

          // 수정된 noteList로 로컬 스토리지 업데이트
          if (loadSto[0].memosubtitle !== "" || loadSto[0].memocontent !== "") {
            localStorage.setItem("noteList", JSON.stringify(loadSto));
          }
        }
      }
    });
  };

  return (
    <div className="w-full ">
      <div className="img-box flex justify-between p-2 bg-gray-100 dark:bg-gray-800 dark:border-b-[1px]">
        <div className="flex justify-around w-[500px] ">
          <button className="w-[24px] h-[24px]">
            <Image
              src={screenMode === "dark" ? "/img/darkmode/check-list-white.png" : "/img/check-list.png"}
              alt={screenMode === "dark" ? "check-list-white-img" : "check-list-img"}
              width={24}
              height={24}
              className=""
            />
          </button>
          <button className="w-[24px] h-[24px]">
            <Image
              src={screenMode === "dark" ? "/img/darkmode/image-white.png" : "/img/image.png"}
              alt={screenMode === "dark" ? "image-white-img" : "image-img"}
              width={24}
              height={24}
              className=""
            />
          </button>
          <button className="w-[24px] h-[24px]">
            <Image
              src={screenMode === "dark" ? "/img/darkmode/plus-circle-white.png" : "/img/plus-circle.png"}
              alt={screenMode === "dark" ? "plus-circle-white-img" : "plus-circle-img"}
              width={24}
              height={24}
              className=""
            />
          </button>
          <Image src="/img/vbar.png" alt="vertical-bar-img" width={24} height={24} className="rotate-90 " />
          <button className="w-[24px] h-[24px]">
            <Image
              src={screenMode === "dark" ? "/img/darkmode/pin-white.png" : "/img/pin.png"}
              alt={screenMode === "dark" ? "pin-white-img" : "pin-img"}
              width={24}
              height={24}
              className=""
            />
          </button>
          <button className="w-[24px] h-[24px]">
            <Image
              src={screenMode === "dark" ? "/img/darkmode/star-white.png" : "/img/star.png"}
              alt={screenMode === "dark" ? "star-white-img" : "star-img"}
              width={24}
              height={24}
              className=""
            />
          </button>
          <button className="w-[24px] h-[24px]">
            <Image
              src={screenMode === "dark" ? "/img/darkmode/share-white.png" : "/img/share.png"}
              alt={screenMode === "dark" ? "share-white-img" : "share-img"}
              width={24}
              height={24}
              className=""
            />
          </button>
          <button className="w-[24px] h-[24px]">
            <Image
              src={screenMode === "dark" ? "/img/darkmode/option-white.png" : "/img/option.png"}
              alt={screenMode === "dark" ? "option-white-img" : "option-img"}
              width={24}
              height={24}
              className=""
            />
          </button>
        </div>
        <button>
          <Image
            src={screenMode === "dark" ? "/img/darkmode/maximize-white.png" : "/img/maximize.png"}
            alt={screenMode === "dark" ? "maximize-white-img" : "maximize-img"}
            width={24}
            height={24}
            className="mr-2"
          />
        </button>
      </div>
      <div className="w-full h-full  relative">
        <LexicalComposer initialConfig={initialConfig}>
          <PlainTextPlugin
            contentEditable={
              <ContentEditable className="h-full p-4 border-r-2 border-b-2 focus:outline-none dark:bg-gray-800 dark:caret-white dark:text-white " />
            }
            placeholder={
              <div className="absolute top-[18px] left-[18px] text-gray-400">
                Type / for menu or <span className="font-bold underline">select from Templates</span>
              </div>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
          <OnChangePlugin onChange={handleContentChange} />
          <HistoryPlugin />
        </LexicalComposer>
      </div>
    </div>
  );
}
