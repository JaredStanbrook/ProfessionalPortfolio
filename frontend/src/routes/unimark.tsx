import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input' // assuming there's an input component
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { createFileRoute } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Trash } from 'lucide-react'
import { toast } from 'sonner'

export const Route = createFileRoute('/unimark')({
  component: Assignments,
})

function Assignments() {
  // State to store assignments with marks and weights
  const [assignments, setAssignments] = useState([
    { id: 1, mark: '', weight: '' },
    { id: 2, mark: '', weight: '' },
    { id: 3, mark: '', weight: '' },
    { id: 4, mark: '', weight: '' },
  ])

  // State for the expected final average
  const [expected, setExpected] = useState('')

  type AssignmentField = 'mark' | 'weight'

  // Function to handle input change
  const handleInputChange = (
    index: number,
    field: AssignmentField,
    value: string,
  ) => {
    const updatedAssignments = [...assignments]
    updatedAssignments[index][field] = value
    setAssignments(updatedAssignments)
  }

  const calculateNeededAverage = () => {
    let totalWeightCompleted = 0
    let weightedSumCompleted = 0
    let remainingWeight = 0
    const expectedAverage = parseFloat(expected) // Get expected average from state

    assignments.forEach((assignment) => {
      const mark = parseFloat(assignment.mark)
      const weight = parseFloat(assignment.weight)

      if (!isNaN(mark) && !isNaN(weight)) {
        weightedSumCompleted += mark * (weight / 100)
        totalWeightCompleted += weight
      } else if (!isNaN(weight)) {
        remainingWeight += weight // For ungraded assignments
      }
    })

    if (remainingWeight === 0) return 'No remaining assignments.'

    // Calculate the remaining average needed for ungraded assignments
    const requiredAverageForRemaining =
      ((expectedAverage / 100 - weightedSumCompleted / 100) * 100) /
      (remainingWeight / 100)

    return requiredAverageForRemaining >= 0
      ? `You need an average of ${requiredAverageForRemaining.toFixed(2)}% on the remaining assignments.`
      : "You've already exceeded the expected average!"
  }

  return (
    <div className="p-2 max-w-3xl m-auto">
      <Table>
        <TableCaption>Enter assignment marks and weights.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Assignment</TableHead>
            <TableHead>Mark (%)</TableHead>
            <TableHead>Weight (%)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {assignments.map((assignment, index) => (
            <TableRow key={assignment.id}>
              <TableCell className="font-medium">
                Assignment {assignment.id}
              </TableCell>
              <TableCell>
                <Input
                  type="number"
                  value={assignment.mark}
                  onChange={(e) =>
                    handleInputChange(index, 'mark', e.target.value)
                  }
                  placeholder="Enter mark"
                />
              </TableCell>
              <TableCell>
                <Input
                  type="number"
                  value={assignment.weight}
                  onChange={(e) =>
                    handleInputChange(index, 'weight', e.target.value)
                  }
                  placeholder="Enter weight"
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="mt-4">
        <Input
          type="number"
          value={expected}
          onChange={(e) => setExpected(e.target.value)} // Update state for expected mark
          placeholder="Enter Expected Final Mark (%)"
        />
      </div>

      <div className="mt-4">
        <p className="mt-2">Result: {calculateNeededAverage()}</p>
      </div>
    </div>
  )
}
