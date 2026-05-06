import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { Link } from "react-router-dom";
import { StatusBadge } from "../common/StatusBadge";
import { formatDate } from "../../utils/helpers";

const columns = ["backlog", "todo", "in-progress", "review", "done"];

export const KanbanBoard = ({ tasks = [], onMove }) => (
  <DragDropContext onDragEnd={onMove}>
    <div className="grid gap-4 xl:grid-cols-5">
      {columns.map((column) => (
        <Droppable droppableId={column} key={column}>
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps} className="panel min-h-[20rem] p-4">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-sm font-semibold capitalize">{column}</h3>
                <StatusBadge tone={column}>{tasks.filter((task) => task.status === column).length}</StatusBadge>
              </div>
              <div className="space-y-3">
                {tasks
                  .filter((task) => task.status === column)
                  .map((task, index) => (
                    <Draggable draggableId={task._id} index={index} key={task._id}>
                      {(dragProvided) => (
                        <div
                          ref={dragProvided.innerRef}
                          {...dragProvided.draggableProps}
                          {...dragProvided.dragHandleProps}
                          className="rounded-3xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950"
                        >
                          <Link to={`/tasks/${task._id}`} className="font-semibold hover:text-emerald-600 dark:hover:text-emerald-300">
                            {task.title}
                          </Link>
                          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{task.project?.name}</p>
                          <div className="mt-3 flex items-center justify-between text-xs">
                            <StatusBadge tone={task.priority}>{task.priority}</StatusBadge>
                            <span className="text-slate-500 dark:text-slate-400">{formatDate(task.dueDate)}</span>
                          </div>
                          <div className="mt-3">
                            <Link to={`/tasks/${task._id}`} className="text-xs font-semibold text-emerald-600 dark:text-emerald-300">
                              Open task
                            </Link>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                {provided.placeholder}
              </div>
            </div>
          )}
        </Droppable>
      ))}
    </div>
  </DragDropContext>
);
