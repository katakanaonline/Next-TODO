import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, beforeEach } from "vitest";
import Home from "./page";

describe("TODO App", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe("初期表示", () => {
    it("タイトルが表示される", () => {
      render(<Home />);
      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
        "TODO App"
      );
    });

    it("タスクがない場合は「タスクがありません」と表示される", () => {
      render(<Home />);
      expect(screen.getByText("タスクがありません")).toBeInTheDocument();
    });

    it("入力フィールドとボタンが表示される", () => {
      render(<Home />);
      expect(
        screen.getByPlaceholderText("新しいタスクを入力...")
      ).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "追加" })).toBeInTheDocument();
    });
  });

  describe("タスク追加", () => {
    it("入力欄にテキストを入力してボタンをクリックするとタスクが追加される", async () => {
      const user = userEvent.setup();
      render(<Home />);

      const input = screen.getByPlaceholderText("新しいタスクを入力...");
      const addButton = screen.getByRole("button", { name: "追加" });

      await user.type(input, "買い物に行く");
      await user.click(addButton);

      expect(screen.getByText("買い物に行く")).toBeInTheDocument();
      expect(input).toHaveValue("");
    });

    it("Enterキーを押すとタスクが追加される", async () => {
      const user = userEvent.setup();
      render(<Home />);

      const input = screen.getByPlaceholderText("新しいタスクを入力...");

      await user.type(input, "掃除をする{Enter}");

      expect(screen.getByText("掃除をする")).toBeInTheDocument();
    });

    it("空白のみの入力ではタスクが追加されない", async () => {
      const user = userEvent.setup();
      render(<Home />);

      const input = screen.getByPlaceholderText("新しいタスクを入力...");
      const addButton = screen.getByRole("button", { name: "追加" });

      await user.type(input, "   ");
      await user.click(addButton);

      expect(screen.getByText("タスクがありません")).toBeInTheDocument();
    });

    it("入力値の前後の空白はトリムされる", async () => {
      const user = userEvent.setup();
      render(<Home />);

      const input = screen.getByPlaceholderText("新しいタスクを入力...");
      const addButton = screen.getByRole("button", { name: "追加" });

      await user.type(input, "  テスト  ");
      await user.click(addButton);

      expect(screen.getByText("テスト")).toBeInTheDocument();
    });

    it("複数のタスクを追加できる", async () => {
      const user = userEvent.setup();
      render(<Home />);

      const input = screen.getByPlaceholderText("新しいタスクを入力...");
      const addButton = screen.getByRole("button", { name: "追加" });

      await user.type(input, "タスク1");
      await user.click(addButton);
      await user.type(input, "タスク2");
      await user.click(addButton);
      await user.type(input, "タスク3");
      await user.click(addButton);

      expect(screen.getByText("タスク1")).toBeInTheDocument();
      expect(screen.getByText("タスク2")).toBeInTheDocument();
      expect(screen.getByText("タスク3")).toBeInTheDocument();
    });
  });

  describe("タスク完了/未完了の切り替え", () => {
    it("チェックボックスをクリックするとタスクが完了状態になる", async () => {
      const user = userEvent.setup();
      render(<Home />);

      const input = screen.getByPlaceholderText("新しいタスクを入力...");
      const addButton = screen.getByRole("button", { name: "追加" });

      await user.type(input, "完了テスト");
      await user.click(addButton);

      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).not.toBeChecked();

      await user.click(checkbox);
      expect(checkbox).toBeChecked();
    });

    it("完了したタスクを再度クリックすると未完了になる", async () => {
      const user = userEvent.setup();
      render(<Home />);

      const input = screen.getByPlaceholderText("新しいタスクを入力...");
      const addButton = screen.getByRole("button", { name: "追加" });

      await user.type(input, "トグルテスト");
      await user.click(addButton);

      const checkbox = screen.getByRole("checkbox");
      await user.click(checkbox);
      expect(checkbox).toBeChecked();

      await user.click(checkbox);
      expect(checkbox).not.toBeChecked();
    });

    it("完了状態のタスクには取り消し線が表示される", async () => {
      const user = userEvent.setup();
      render(<Home />);

      const input = screen.getByPlaceholderText("新しいタスクを入力...");
      const addButton = screen.getByRole("button", { name: "追加" });

      await user.type(input, "スタイルテスト");
      await user.click(addButton);

      const taskText = screen.getByText("スタイルテスト");
      expect(taskText).not.toHaveClass("line-through");

      const checkbox = screen.getByRole("checkbox");
      await user.click(checkbox);

      expect(taskText).toHaveClass("line-through");
    });
  });

  describe("タスク削除", () => {
    it("削除ボタンをクリックするとタスクが削除される", async () => {
      const user = userEvent.setup();
      render(<Home />);

      const input = screen.getByPlaceholderText("新しいタスクを入力...");
      const addButton = screen.getByRole("button", { name: "追加" });

      await user.type(input, "削除テスト");
      await user.click(addButton);

      expect(screen.getByText("削除テスト")).toBeInTheDocument();

      const deleteButton = screen.getByRole("button", { name: "削除" });
      await user.click(deleteButton);

      expect(screen.queryByText("削除テスト")).not.toBeInTheDocument();
      expect(screen.getByText("タスクがありません")).toBeInTheDocument();
    });

    it("複数タスクの中から特定のタスクを削除できる", async () => {
      const user = userEvent.setup();
      render(<Home />);

      const input = screen.getByPlaceholderText("新しいタスクを入力...");
      const addButton = screen.getByRole("button", { name: "追加" });

      await user.type(input, "残すタスク");
      await user.click(addButton);
      await user.type(input, "削除するタスク");
      await user.click(addButton);

      const deleteButtons = screen.getAllByRole("button", { name: "削除" });
      await user.click(deleteButtons[1]);

      expect(screen.getByText("残すタスク")).toBeInTheDocument();
      expect(screen.queryByText("削除するタスク")).not.toBeInTheDocument();
    });
  });

  describe("完了数カウント", () => {
    it("タスク追加時に完了数が表示される", async () => {
      const user = userEvent.setup();
      render(<Home />);

      const input = screen.getByPlaceholderText("新しいタスクを入力...");
      const addButton = screen.getByRole("button", { name: "追加" });

      await user.type(input, "カウントテスト");
      await user.click(addButton);

      expect(screen.getByText("0 / 1 完了")).toBeInTheDocument();
    });

    it("タスクを完了すると完了数が増加する", async () => {
      const user = userEvent.setup();
      render(<Home />);

      const input = screen.getByPlaceholderText("新しいタスクを入力...");
      const addButton = screen.getByRole("button", { name: "追加" });

      await user.type(input, "タスクA");
      await user.click(addButton);
      await user.type(input, "タスクB");
      await user.click(addButton);

      expect(screen.getByText("0 / 2 完了")).toBeInTheDocument();

      const checkboxes = screen.getAllByRole("checkbox");
      await user.click(checkboxes[0]);

      expect(screen.getByText("1 / 2 完了")).toBeInTheDocument();
    });

    it("全タスク削除時にカウントが非表示になる", async () => {
      const user = userEvent.setup();
      render(<Home />);

      const input = screen.getByPlaceholderText("新しいタスクを入力...");
      const addButton = screen.getByRole("button", { name: "追加" });

      await user.type(input, "唯一のタスク");
      await user.click(addButton);

      expect(screen.getByText("0 / 1 完了")).toBeInTheDocument();

      const deleteButton = screen.getByRole("button", { name: "削除" });
      await user.click(deleteButton);

      expect(screen.queryByText(/完了/)).not.toBeInTheDocument();
    });
  });

  describe("LocalStorage永続化", () => {
    it("タスクがLocalStorageに保存される", async () => {
      const user = userEvent.setup();
      render(<Home />);

      const input = screen.getByPlaceholderText("新しいタスクを入力...");
      const addButton = screen.getByRole("button", { name: "追加" });

      await user.type(input, "保存テスト");
      await user.click(addButton);

      await waitFor(() => {
        const saved = localStorage.getItem("todos");
        expect(saved).not.toBeNull();
        const todos = JSON.parse(saved!);
        expect(todos).toHaveLength(1);
        expect(todos[0].text).toBe("保存テスト");
        expect(todos[0].completed).toBe(false);
      });
    });

    it("LocalStorageからタスクが復元される", async () => {
      const initialTodos = [
        { id: 1, text: "復元タスク1", completed: false },
        { id: 2, text: "復元タスク2", completed: true },
      ];
      localStorage.setItem("todos", JSON.stringify(initialTodos));

      render(<Home />);

      await waitFor(() => {
        expect(screen.getByText("復元タスク1")).toBeInTheDocument();
        expect(screen.getByText("復元タスク2")).toBeInTheDocument();
      });

      const checkboxes = screen.getAllByRole("checkbox");
      expect(checkboxes[0]).not.toBeChecked();
      expect(checkboxes[1]).toBeChecked();
    });

    it("完了状態の変更がLocalStorageに反映される", async () => {
      const user = userEvent.setup();
      render(<Home />);

      const input = screen.getByPlaceholderText("新しいタスクを入力...");
      const addButton = screen.getByRole("button", { name: "追加" });

      await user.type(input, "状態変更テスト");
      await user.click(addButton);

      const checkbox = screen.getByRole("checkbox");
      await user.click(checkbox);

      await waitFor(() => {
        const saved = localStorage.getItem("todos");
        const todos = JSON.parse(saved!);
        expect(todos[0].completed).toBe(true);
      });
    });

    it("タスク削除がLocalStorageに反映される", async () => {
      const user = userEvent.setup();
      render(<Home />);

      const input = screen.getByPlaceholderText("新しいタスクを入力...");
      const addButton = screen.getByRole("button", { name: "追加" });

      await user.type(input, "削除保存テスト");
      await user.click(addButton);

      const deleteButton = screen.getByRole("button", { name: "削除" });
      await user.click(deleteButton);

      await waitFor(() => {
        const saved = localStorage.getItem("todos");
        const todos = JSON.parse(saved!);
        expect(todos).toHaveLength(0);
      });
    });
  });
});
