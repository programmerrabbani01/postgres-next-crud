import dbConnection, { pool } from "@/utils/dbConnect.ts";
import Link from "next/link.js";
import { redirect } from "next/navigation";

export default async function Home() {
  dbConnection();

  // create
  async function createNote(data: FormData) {
    "use server";
    const note = data.get("note")?.toString();
    const date = data.get("date")?.toString();

    if (!note || !date) {
      console.error("Note or Date is missing.");
      return;
    }

    try {
      const newNote = await pool.query(
        "INSERT INTO notes (note, date) VALUES ($1, $2) RETURNING *",
        [note, date]
      );
      console.log(newNote.rows[0]);

      // Reset the form after successful creation
      form.reset();
    } catch (error) {
      console.error("Error creating note:", error);
    }

    redirect("/");
  }

  // read

  const data = await pool.query("SELECT *FROM notes");
  const result = data.rows;

  // delete

  // Delete note handler
  const deleteNote = async (data) => {
    "use server";

    const id = data.get("id")?.toString();

    try {
      await pool.query("DELETE FROM notes WHERE id=$1", [id]);
      console.log("Note deleted successfully");
    } catch (error) {
      console.error("Error deleting note:", error);
    }

    redirect("/");
  };

  return (
    <main className="m-10">
      <div className="m-5">
        <h1 className="text-center m-5 text-2xl font-bold uppercase">
          Add Note
        </h1>
        <form action={createNote} className="space-y-5">
          <input
            type="text"
            className="shadow-lg rounded-md shadow-black h-10 p-3 w-full outline-none"
            placeholder="Add Note ..."
            name="note"
            id="note"
          />
          <input
            type="date"
            className="shadow-lg rounded-md shadow-black h-10 p-3 w-full outline-none"
            placeholder="Add Date ..."
            name="date"
            id="date"
          />
          <button
            type="submit"
            className="bg-orange-500 text-white p-3 rounded-md hover:bg-red-600 uppercase font-bold"
          >
            Submit
          </button>
        </form>
      </div>
      {/* show data */}
      <div className="space-y-10">
        {result.map((element) => {
          return (
            <>
              <ul className="flex my-2 shadow-lg shadow-black py-6">
                <li className="text-center w-[50%]">{element.note}</li>
                <li className="text-center w-[30%]">{element.date}</li>
                <li className="text-center w-[20%] space-x-3 flex">
                  <Link
                    href={"/edit/" + element.id}
                    className="bg-cyan-600 font-bold text-white p-2"
                  >
                    Edit
                  </Link>
                  <form action={deleteNote}>
                    <input type="hidden" name="id" value={element.id} />
                    <button
                      type="submit"
                      className="bg-red-600 font-bold text-white p-2"
                    >
                      Delete
                    </button>
                  </form>
                </li>
              </ul>
            </>
          );
        })}
      </div>
    </main>
  );
}
