import dbConnection, { pool } from "@/utils/dbConnect.ts";
import { redirect } from "next/navigation";

export default async function EditPage({ params }) {
  dbConnection();

  const id = params.id;

  const data = await pool.query("SELECT * FROM notes WHERE id = $1", [id]);

  const result = data.rows[0];

  const updateNote = async (data: FormData) => {
    "use server";

    const note = data.get("note")?.toString();
    const date = data.get("date")?.toString();

    try {
      const updateNote = await pool.query(
        "UPDATE notes SET note = $1, date = $2 WHERE id = $3",
        [note, date, id]
      );
      console.log("Note updated", updateNote);
    } catch (error) {
      console.error("Error updating note:", error);
    }

    redirect("/");
  };

  return (
    <>
      <main className="m-10">
        <div className="m-5">
          <h1 className="text-center m-5 text-2xl font-bold uppercase">
            Edit Note
          </h1>
          <form action={updateNote} className="space-y-5">
            <input
              type="text"
              className="shadow-lg rounded-md shadow-black h-10 p-3 w-full outline-none"
              placeholder="Add Note ..."
              name="note"
              id="note"
              defaultValue={result.note}
            />
            <input
              type="date"
              className="shadow-lg rounded-md shadow-black h-10 p-3 w-full outline-none"
              placeholder="Add Date ..."
              name="date"
              id="date"
              defaultValue={result.date}
            />
            <button
              type="submit"
              className="bg-orange-500 text-white p-3 rounded-md hover:bg-red-600 uppercase font-bold"
            >
              Submit
            </button>
          </form>
        </div>
      </main>
    </>
  );
}
