import { useState } from "react";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import Column from "./components/Column";
import initialData from "./initial-data";
import { IColumn, IInitialData, ITask } from "./types";
import styled from "styled-components";

function App() {
  const [state, setState] = useState<IInitialData>(initialData);

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const start = state.columns[source.droppableId];
    const finish = state.columns[destination.droppableId];

    if (start === finish) {
      const newTaskIds = Array.from(start.taskIds);

      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      const newColumn: IColumn = {
        ...finish,
        taskIds: newTaskIds,
      };

      const newState: IInitialData = {
        ...state,
        columns: {
          ...state.columns,
          [newColumn.id]: newColumn,
        },
      };

      setState(newState);
      return;
    }

    const startTaskIds = Array.from(start.taskIds);
    startTaskIds.splice(source.index, 1);
    const newStart: IColumn = {
      ...start,
      taskIds: startTaskIds,
    };

    const finishTaskIds = Array.from(finish.taskIds);
    finishTaskIds.splice(destination.index, 0, draggableId);
    const newFinish: IColumn = {
      ...finish,
      taskIds: finishTaskIds,
    };

    const newState: IInitialData = {
      ...state,
      columns: {
        ...state.columns,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish,
      },
    };

    setState(newState);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Container>
        {state.columnOrder.map((columnId) => {
          const column: IColumn = state.columns[columnId];
          const tasks: ITask[] = column.taskIds.map(
            (taskId) => state.tasks[taskId]
          );

          return <Column key={column.id} column={column} tasks={tasks} />;
        })}
      </Container>
    </DragDropContext>
  );
}

const Container = styled.div`
  display: flex;
`;

export default App;