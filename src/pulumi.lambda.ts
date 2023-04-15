import {
  CdkCustomResourceEvent,
  CdkCustomResourceResponse,
  Context,
} from 'aws-lambda';
import { 
    
} from '@pulumi/pulumi'
import { LocalWorkspace } from '@pulumi/pulumi/automation';

const pulumi = async () => {}

export const handler = async (event: CdkCustomResourceEvent, context: Context): Promise<CdkCustomResourceResponse> => {
  const response: CdkCustomResourceResponse = {
    StackId: event.StackId,
    PhysicalResourceId: context.logGroupName,
  };

  await LocalWorkspace.createOrSelectStack({
    program: pulumi,
    projectName: "pulumi",
    stackName: "development"
  })

  return response;
};