import { ExceptionFilter, ArgumentsHost } from '@hazeljs/core';
import { GuardrailViolationError } from '@hazeljs/guardrails';
/**
 * Maps GuardrailViolationError to HTTP 400 with structured error body.
 * Use this so clients receive clear feedback when content is blocked.
 */
export declare class GuardrailViolationFilter implements ExceptionFilter<GuardrailViolationError> {
    catch(exception: GuardrailViolationError, host: ArgumentsHost): void;
}
