# Architecture Notes

## Emotion engine
The emotion engine is a numeric state machine. Events such as kindness, insult, apology, success, danger and goodbye change values. The state is exposed so the behavior remains inspectable.

## Memory
Version 1 stores recent conversation turns and extracted long-term facts in a JSON file. A database can replace this later.

## Personality
Personality is configuration: traits, principles and communication styles are passed into the response layer.

## Planner
The planner converts a message plus emotional state into a response plan. A production system would use a stronger classifier or model here.

## Model adapter
src/model.js contains the local fallback. A real LLM provider can be placed behind the same boundary.

## Safety
Safety runs before response generation. Sensitive permissions default to off.

## Robot-ready boundary
A future robot adapter should receive structured, permission-checked commands instead of arbitrary generated motor instructions. Physical movement should remain separately constrained from conversation.
